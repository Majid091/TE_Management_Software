import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalEmployees,
      totalProjects,
      totalDepartments,
      projectsByStatus,
      employeesByDepartment,
      employeeAvailability,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.department.count({ where: { deletedAt: null } }),
      this.getProjectsByStatus(),
      this.getEmployeesByDepartment(),
      this.getEmployeeAvailability(),
    ]);

    const revenues = await this.prisma.revenueRecord.findMany({
      where: { deletedAt: null },
    });

    const totalRevenue = revenues.reduce(
      (sum, rev) => sum + Number(rev.amount),
      0,
    );

    return {
      overview: {
        totalEmployees,
        totalProjects,
        totalDepartments,
        totalRevenue,
        employeeGrowth: 12.5,
        projectGrowth: 8.3,
        revenueGrowth: 15.2,
      },
      projectsByStatus,
      employeesByDepartment,
      employeeAvailability,
      recentActivity: [],
      upcomingDeadlines: await this.getUpcomingDeadlines(),
    };
  }

  async getEmployeeAnalytics() {
    const [total, byDepartment, byAvailability] = await Promise.all([
      this.prisma.employee.count({ where: { deletedAt: null } }),
      this.getEmployeesByDepartment(),
      this.getEmployeeAvailability(),
    ]);

    return {
      total,
      byDepartment,
      byAvailability,
      growthTrend: await this.getEmployeeGrowthTrend(),
      averageTenure: 2.5,
      turnoverRate: 8.2,
    };
  }

  async getProjectAnalytics() {
    const [total, byStatus] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.getProjectsByStatus(),
    ]);

    return {
      total,
      byStatus,
      completionTrend: await this.getProjectCompletionTrend(),
      averageDuration: 4.5,
      onTimeCompletion: 75,
      averageBudgetUtilization: 85,
    };
  }

  async getDepartmentAnalytics() {
    const [total, bySize] = await Promise.all([
      this.prisma.department.count({ where: { deletedAt: null } }),
      this.getEmployeesByDepartment(),
    ]);

    const budgetUtilization = await this.getDepartmentBudgetUtilization();

    return {
      total,
      bySize,
      budgetUtilization,
    };
  }

  async getTrends() {
    return {
      employeeGrowth: await this.getEmployeeGrowthTrend(),
      projectCompletion: await this.getProjectCompletionTrend(),
    };
  }

  private async getProjectsByStatus() {
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
    });

    const statusCount = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = projects.length;

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  private async getEmployeesByDepartment() {
    const employees = await this.prisma.employee.findMany({
      where: { deletedAt: null },
      include: {
        department: true,
      },
    });

    const deptCount = employees.reduce((acc, emp) => {
      const deptName = emp.department?.name || 'Unassigned';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCount).map(([department, count]) => ({
      department,
      count,
    }));
  }

  private async getEmployeeAvailability() {
    const employees = await this.prisma.employee.findMany({
      where: { deletedAt: null },
    });

    const availabilityCount = employees.reduce((acc, emp) => {
      acc[emp.availability] = (acc[emp.availability] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = employees.length;

    return Object.entries(availabilityCount).map(([status, count]) => ({
      status,
      count,
      percentage:
        total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  private async getUpcomingDeadlines() {
    const projects = await this.prisma.project.findMany({
      where: {
        endDate: {
          gt: new Date(),
        },
        status: 'in_progress',
        deletedAt: null,
      },
      orderBy: {
        endDate: 'asc',
      },
      take: 5,
    });

    return projects.map((project) => {
      const daysLeft = Math.ceil(
        (new Date(project.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        id: Number(project.id),
        project: project.name,
        deadline: project.endDate,
        daysLeft,
      };
    });
  }

  private async getEmployeeGrowthTrend() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentYear = new Date().getFullYear();
    const employees = await this.prisma.employee.findMany({
      where: { deletedAt: null },
    });

    return months.map((month, index) => {
      const count = employees.filter((emp) => {
        const hireDate = new Date(emp.hireDate);
        return (
          hireDate.getFullYear() <= currentYear &&
          (hireDate.getFullYear() < currentYear ||
            hireDate.getMonth() <= index)
        );
      }).length;

      return { month, count };
    });
  }

  private async getProjectCompletionTrend() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentYear = new Date().getFullYear();
    const projects = await this.prisma.project.findMany({
      where: { status: 'completed', deletedAt: null },
    });

    return months.map((month, index) => {
      const completed = projects.filter((proj) => {
        const endDate = new Date(proj.endDate);
        return (
          endDate.getFullYear() === currentYear &&
          endDate.getMonth() === index
        );
      }).length;

      return { month, completed };
    });
  }

  private async getDepartmentBudgetUtilization() {
    const departments = await this.prisma.department.findMany({
      where: { deletedAt: null },
    });

    return departments.map((dept) => ({
      department: dept.name,
      utilized: Math.floor(Math.random() * 30) + 65,
      allocated: Number(dept.budget),
    }));
  }
}
