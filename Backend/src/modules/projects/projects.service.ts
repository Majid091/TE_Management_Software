import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PaginatedResponseDto } from '../../common/dtos/pagination.dto';
import {
  CreateProjectDto,
  UpdateProjectDto,
  FilterProjectDto,
  AssignEmployeeDto,
} from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    if (new Date(createProjectDto.endDate) < new Date(createProjectDto.startDate)) {
      throw new BadRequestException('End date must be after start date');
    }

    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        status: createProjectDto.status,
        priority: createProjectDto.priority,
        departmentId: BigInt(createProjectDto.departmentId),
        managerId: BigInt(createProjectDto.managerId),
        client: createProjectDto.client,
        startDate: createProjectDto.startDate,
        endDate: createProjectDto.endDate,
        budget: createProjectDto.budget || 0,
        progress: createProjectDto.progress || 0,
        tags: createProjectDto.tags || [],
      },
    });

    return this.findOne(Number(project.id));
  }

  async findAll(filterDto: FilterProjectDto) {
    const { page, limit, search, status, department } = filterDto;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (department) {
      where.departmentId = BigInt(department);
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          department: true,
          manager: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    const formattedProjects = await Promise.all(
      projects.map((proj) => this.formatProject(proj)),
    );

    return new PaginatedResponseDto(formattedProjects, page, limit, total);
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        department: true,
        manager: true,
        projectAssignments: {
          where: { unassignedAt: null },
          include: {
            employee: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.formatProjectWithTeam(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      updateProjectDto.startDate &&
      updateProjectDto.endDate &&
      new Date(updateProjectDto.endDate) < new Date(updateProjectDto.startDate)
    ) {
      throw new BadRequestException('End date must be after start date');
    }

    const updateData: any = { ...updateProjectDto };

    if (updateProjectDto.departmentId) {
      updateData.departmentId = BigInt(updateProjectDto.departmentId);
    }

    if (updateProjectDto.managerId) {
      updateData.managerId = BigInt(updateProjectDto.managerId);
    }

    await this.prisma.project.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });
  }

  async assignEmployee(projectId: number, assignEmployeeDto: AssignEmployeeDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(projectId), deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: BigInt(assignEmployeeDto.employeeId), deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const existingAssignment = await this.prisma.projectAssignment.findFirst({
      where: {
        projectId: BigInt(projectId),
        employeeId: BigInt(assignEmployeeDto.employeeId),
        unassignedAt: null,
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('Employee already assigned to this project');
    }

    await this.prisma.projectAssignment.create({
      data: {
        projectId: BigInt(projectId),
        employeeId: BigInt(assignEmployeeDto.employeeId),
        role: assignEmployeeDto.role,
        allocationPercentage: assignEmployeeDto.allocationPercentage || 100,
        assignedAt: new Date(),
      },
    });

    return this.findOne(projectId);
  }

  async removeEmployee(projectId: number, employeeId: number) {
    const assignment = await this.prisma.projectAssignment.findFirst({
      where: {
        projectId: BigInt(projectId),
        employeeId: BigInt(employeeId),
        unassignedAt: null,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.prisma.projectAssignment.update({
      where: { id: assignment.id },
      data: {
        unassignedAt: new Date(),
      },
    });

    return this.findOne(projectId);
  }

  async getByStatus(status: string) {
    const projects = await this.prisma.project.findMany({
      where: { status: status as any, deletedAt: null },
      include: {
        department: true,
        manager: true,
      },
    });

    return Promise.all(projects.map((proj) => this.formatProject(proj)));
  }

  async updateStatus(id: number, status: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.update({
      where: { id: BigInt(id) },
      data: { status: status as any },
    });

    return this.findOne(id);
  }

  private async formatProject(project: any) {
    const teamCount = await this.prisma.projectAssignment.count({
      where: { projectId: project.id, unassignedAt: null },
    });

    return {
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      department: {
        id: project.department?.id?.toString(),
        name: project.department?.name,
      },
      startDate: project.startDate,
      endDate: project.endDate,
      budget: Number(project.budget),
      progress: project.progress,
      priority: project.priority,
      team: [],
      manager: {
        id: project.manager?.id?.toString(),
        name: project.manager
          ? `${project.manager.firstName} ${project.manager.lastName}`
          : '',
      },
      client: project.client,
      tags: project.tags || [],
    };
  }

  private async formatProjectWithTeam(project: any) {
    const formatted = await this.formatProject(project);

    return {
      ...formatted,
      team:
        project.projectAssignments?.map((assignment: any) => ({
          id: assignment.employee?.id?.toString(),
          name: assignment.employee
            ? `${assignment.employee.firstName} ${assignment.employee.lastName}`
            : '',
          role: assignment.role,
          allocationPercentage: assignment.allocationPercentage,
        })) || [],
    };
  }
}
