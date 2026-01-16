import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PaginatedResponseDto, PaginationDto } from '../../common/dtos/pagination.dto';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const existingDepartment = await this.prisma.department.findUnique({
      where: { name: createDepartmentDto.name },
    });

    if (existingDepartment) {
      throw new BadRequestException('Department with this name already exists');
    }

    const department = await this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
        description: createDepartmentDto.description,
        budget: createDepartmentDto.budget || 0,
        location: createDepartmentDto.location,
        email: createDepartmentDto.email,
        phone: createDepartmentDto.phone,
        headId: createDepartmentDto.headId ? BigInt(createDepartmentDto.headId) : null,
      },
    });

    return this.findOne(Number(department.id));
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [departments, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        include: {
          head: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.department.count({ where }),
    ]);

    const formattedDepartments = await Promise.all(
      departments.map((dept) => this.formatDepartment(dept)),
    );

    return new PaginatedResponseDto(formattedDepartments, page, limit, total);
  }

  async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        head: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.formatDepartment(department);
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
      const existing = await this.prisma.department.findUnique({
        where: { name: updateDepartmentDto.name },
      });

      if (existing) {
        throw new BadRequestException('Department with this name already exists');
      }
    }

    const updateData: any = { ...updateDepartmentDto };

    if (updateDepartmentDto.headId !== undefined) {
      updateData.headId = updateDepartmentDto.headId ? BigInt(updateDepartmentDto.headId) : null;
    }

    await this.prisma.department.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const employeeCount = await this.prisma.employee.count({
      where: { departmentId: BigInt(id), deletedAt: null },
    });

    if (employeeCount > 0) {
      throw new BadRequestException(
        'Cannot delete department with assigned employees',
      );
    }

    await this.prisma.department.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });
  }

  async getEmployees(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const employees = await this.prisma.employee.findMany({
      where: { departmentId: BigInt(id), deletedAt: null },
      include: {
        user: true,
      },
    });

    return employees.map((emp) => ({
      id: emp.id.toString(),
      name: `${emp.firstName} ${emp.lastName}`,
      position: emp.position,
      email: emp.user?.email,
      availability: emp.availability,
    }));
  }

  async getProjects(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const projects = await this.prisma.project.findMany({
      where: { departmentId: BigInt(id), deletedAt: null },
    });

    return projects.map((proj) => ({
      id: proj.id.toString(),
      name: proj.name,
      status: proj.status,
      progress: proj.progress,
      startDate: proj.startDate,
      endDate: proj.endDate,
    }));
  }

  async getStats(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const employeeCount = await this.prisma.employee.count({
      where: { departmentId: BigInt(id), deletedAt: null },
    });

    const projects = await this.prisma.project.findMany({
      where: { departmentId: BigInt(id), deletedAt: null },
    });

    const activeProjects = projects.filter(
      (p) => p.status === 'in_progress',
    ).length;

    return {
      employeeCount,
      projectCount: projects.length,
      budget: Number(department.budget),
      activeProjects,
    };
  }

  private async formatDepartment(department: any) {
    const employeeCount = await this.prisma.employee.count({
      where: { departmentId: department.id, deletedAt: null },
    });

    const projectCount = await this.prisma.project.count({
      where: { departmentId: department.id, deletedAt: null },
    });

    return {
      id: department.id.toString(),
      name: department.name,
      description: department.description,
      head: department.head
        ? {
            id: department.head.id.toString(),
            name: `${department.head.firstName} ${department.head.lastName}`,
          }
        : null,
      employeeCount,
      projectCount,
      budget: Number(department.budget),
      location: department.location,
      email: department.email,
      phone: department.phone,
      createdAt: department.createdAt,
    };
  }
}
