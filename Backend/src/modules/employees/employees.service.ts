import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { PaginatedResponseDto } from '../../common/dtos/pagination.dto';
import { UserRole } from '../../common/enums';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateAvailabilityDto,
  FilterEmployeeDto,
} from './dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createEmployeeDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: createEmployeeDto.email,
          passwordHash: hashedPassword,
          role: createEmployeeDto.role || UserRole.EMPLOYEE,
        },
      });

      const employee = await prisma.employee.create({
        data: {
          userId: user.id,
          firstName: createEmployeeDto.firstName,
          lastName: createEmployeeDto.lastName,
          phone: createEmployeeDto.phone,
          position: createEmployeeDto.position,
          departmentId: BigInt(createEmployeeDto.departmentId),
          availability: createEmployeeDto.availability,
          hireDate: createEmployeeDto.hireDate || new Date(),
          salary: createEmployeeDto.salary,
          skills: createEmployeeDto.skills || [],
          avatarUrl: createEmployeeDto.avatarUrl,
          managerId: createEmployeeDto.managerId ? BigInt(createEmployeeDto.managerId) : null,
        },
      });

      return employee.id;
    });

    return this.findOne(Number(result));
  }

  async findAll(filterDto: FilterEmployeeDto) {
    const { page, limit, search, department, availability } = filterDto;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (department) {
      where.departmentId = BigInt(department);
    }

    if (availability) {
      where.availability = availability;
    }

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: {
          department: true,
          manager: true,
          user: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ]);

    const formattedEmployees = employees.map((emp) => this.formatEmployee(emp));

    return new PaginatedResponseDto(formattedEmployees, page, limit, total);
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        department: true,
        manager: true,
        user: true,
        projectAssignments: {
          where: { unassignedAt: null },
          include: {
            project: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.formatEmployeeWithProjects(employee);
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const updateData: any = { ...updateEmployeeDto };

    if (updateEmployeeDto.departmentId) {
      updateData.departmentId = BigInt(updateEmployeeDto.departmentId);
    }

    if (updateEmployeeDto.managerId) {
      updateData.managerId = BigInt(updateEmployeeDto.managerId);
    }

    await this.prisma.employee.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.prisma.$transaction([
      this.prisma.employee.update({
        where: { id: BigInt(id) },
        data: { deletedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: employee.userId },
        data: { deletedAt: new Date() },
      }),
    ]);
  }

  async updateAvailability(id: number, updateAvailabilityDto: UpdateAvailabilityDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.prisma.employee.update({
      where: { id: BigInt(id) },
      data: {
        availability: updateAvailabilityDto.availability,
      },
    });

    return this.findOne(id);
  }

  async getByDepartment(departmentId: number) {
    const employees = await this.prisma.employee.findMany({
      where: { departmentId: BigInt(departmentId), deletedAt: null },
      include: {
        user: true,
        manager: true,
      },
    });

    return employees.map((emp) => this.formatEmployee(emp));
  }

  async getProjects(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        projectAssignments: {
          where: { unassignedAt: null },
          include: {
            project: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee.projectAssignments.map((assignment) => ({
      id: assignment.project.id.toString(),
      name: assignment.project.name,
      role: assignment.role,
      allocationPercentage: assignment.allocationPercentage,
      assignedAt: assignment.assignedAt,
    }));
  }

  private formatEmployee(employee: any) {
    return {
      id: employee.id.toString(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.user?.email || '',
      phone: employee.phone,
      position: employee.position,
      department: {
        id: employee.department?.id?.toString(),
        name: employee.department?.name,
      },
      availability: employee.availability,
      hireDate: employee.hireDate,
      salary: employee.salary ? Number(employee.salary) : null,
      skills: employee.skills || [],
      avatar: employee.avatarUrl,
      manager: employee.manager
        ? {
            id: employee.manager.id.toString(),
            name: `${employee.manager.firstName} ${employee.manager.lastName}`,
          }
        : null,
    };
  }

  private formatEmployeeWithProjects(employee: any) {
    const formatted = this.formatEmployee(employee);

    return {
      ...formatted,
      projects:
        employee.projectAssignments?.map((assignment: any) => ({
          id: assignment.project?.id?.toString(),
          name: assignment.project?.name,
          role: assignment.role,
        })) || [],
    };
  }
}
