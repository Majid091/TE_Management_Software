import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { AccountStatus } from '../../common/enums';
import { LoginDto, ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.handleSuccessfulLogin(user.id);

    const tokens = await this.generateTokens(user);

    await this.saveRefreshToken(Number(user.id), tokens.refreshToken);

    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id, deletedAt: null },
      include: { department: true },
    });

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        role: user.role,
        department: employee?.department?.name || '',
        avatar: employee?.avatarUrl || null,
      },
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: BigInt(payload.sub), deletedAt: null },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (user.refreshTokenExpiresAt && new Date() > user.refreshTokenExpiresAt) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const tokens = await this.generateTokens(user);
      await this.saveRefreshToken(Number(user.id), tokens.refreshToken);

      return {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId), deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id, deletedAt: null },
      include: { department: true },
    });

    return {
      id: user.id.toString(),
      email: user.email,
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      role: user.role,
      department: employee?.department?.name || '',
      avatar: employee?.avatarUrl || null,
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId), deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: {
        passwordHash: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(user: any) {
    const payload = { sub: Number(user.id), email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const expiresIn = this.configService.get('jwt.refreshExpiresIn');
    const expirationDate = new Date();

    const days = parseInt(expiresIn.replace('d', ''));
    expirationDate.setDate(expirationDate.getDate() + days);

    await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: {
        refreshToken,
        refreshTokenExpiresAt: expirationDate,
      },
    });
  }

  private async handleFailedLogin(userId: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const failedAttempts = user.failedLoginAttempts + 1;
    const updateData: any = { failedLoginAttempts: failedAttempts };

    if (failedAttempts >= 5) {
      const lockoutTime = new Date();
      lockoutTime.setMinutes(lockoutTime.getMinutes() + 30);
      updateData.lockedUntil = lockoutTime;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  private async handleSuccessfulLogin(userId: bigint) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }
}
