import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRevenueDto, UpdateRevenueDto, DateRangeDto } from './dto';

@Injectable()
export class RevenueService {
  constructor(private prisma: PrismaService) {}

  async create(createRevenueDto: CreateRevenueDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(createRevenueDto.projectId), deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const profit = Number(createRevenueDto.amount) - Number(createRevenueDto.expense || 0);

    const revenue = await this.prisma.revenueRecord.create({
      data: {
        projectId: BigInt(createRevenueDto.projectId),
        amount: createRevenueDto.amount,
        expense: createRevenueDto.expense || 0,
        profit,
        periodStart: createRevenueDto.periodStart,
        periodEnd: createRevenueDto.periodEnd,
        description: createRevenueDto.description,
      },
    });

    return this.findOne(Number(revenue.id));
  }

  async findAll() {
    const revenues = await this.prisma.revenueRecord.findMany({
      where: { deletedAt: null },
      include: {
        project: true,
      },
    });

    return revenues.map((rev) => this.formatRevenue(rev));
  }

  async findOne(id: number) {
    const revenue = await this.prisma.revenueRecord.findUnique({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        project: true,
      },
    });

    if (!revenue) {
      throw new NotFoundException('Revenue record not found');
    }

    return this.formatRevenue(revenue);
  }

  async update(id: number, updateRevenueDto: UpdateRevenueDto) {
    const revenue = await this.prisma.revenueRecord.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!revenue) {
      throw new NotFoundException('Revenue record not found');
    }

    const amount = updateRevenueDto.amount !== undefined ? updateRevenueDto.amount : revenue.amount;
    const expense = updateRevenueDto.expense !== undefined ? updateRevenueDto.expense : revenue.expense;
    const profit = Number(amount) - Number(expense);

    const updatedData: any = { ...updateRevenueDto, profit };

    await this.prisma.revenueRecord.update({
      where: { id: BigInt(id) },
      data: updatedData,
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const revenue = await this.prisma.revenueRecord.findUnique({
      where: { id: BigInt(id), deletedAt: null },
    });

    if (!revenue) {
      throw new NotFoundException('Revenue record not found');
    }

    await this.prisma.revenueRecord.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });
  }

  async getSummary() {
    const revenues = await this.prisma.revenueRecord.findMany({
      where: { deletedAt: null },
    });

    const totalRevenue = revenues.reduce(
      (sum, rev) => sum + Number(rev.amount),
      0,
    );
    const totalExpenses = revenues.reduce(
      (sum, rev) => sum + Number(rev.expense),
      0,
    );
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const activeProjects = await this.prisma.project.count({
      where: { status: 'in_progress', deletedAt: null },
    });

    const completedProjects = await this.prisma.project.count({
      where: { status: 'completed', deletedAt: null },
    });

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin: Number(profitMargin.toFixed(2)),
      revenueGrowth: 15.2,
      expenseGrowth: 8.5,
      activeProjects,
      completedProjects,
    };
  }

  async getMonthly(year?: number) {
    const targetYear = year || new Date().getFullYear();

    const revenues = await this.prisma.revenueRecord.findMany({
      where: {
        periodStart: {
          gte: new Date(`${targetYear}-01-01`),
          lte: new Date(`${targetYear}-12-31`),
        },
        deletedAt: null,
      },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2000, i).toLocaleString('en-US', { month: 'short' }),
      revenue: 0,
      expenses: 0,
      profit: 0,
    }));

    revenues.forEach((rev) => {
      const month = new Date(rev.periodStart).getMonth();
      monthlyData[month].revenue += Number(rev.amount);
      monthlyData[month].expenses += Number(rev.expense);
      monthlyData[month].profit += Number(rev.profit);
    });

    return monthlyData;
  }

  async getYearly() {
    const revenues = await this.prisma.revenueRecord.findMany({
      where: { deletedAt: null },
    });

    const yearlyMap = new Map<number, { revenue: number; expenses: number }>();

    revenues.forEach((rev) => {
      const year = new Date(rev.periodStart).getFullYear();
      const existing = yearlyMap.get(year) || { revenue: 0, expenses: 0 };
      yearlyMap.set(year, {
        revenue: existing.revenue + Number(rev.amount),
        expenses: existing.expenses + Number(rev.expense),
      });
    });

    return Array.from(yearlyMap.entries())
      .map(([year, data]) => ({
        year,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses,
      }))
      .sort((a, b) => a.year - b.year);
  }

  async getByDateRange(dateRangeDto: DateRangeDto) {
    const revenues = await this.prisma.revenueRecord.findMany({
      where: {
        periodStart: {
          gte: dateRangeDto.startDate,
        },
        periodEnd: {
          lte: dateRangeDto.endDate,
        },
        deletedAt: null,
      },
    });

    const revenue = revenues.reduce((sum, rev) => sum + Number(rev.amount), 0);
    const expenses = revenues.reduce((sum, rev) => sum + Number(rev.expense), 0);
    const profit = revenue - expenses;

    return {
      startDate: dateRangeDto.startDate,
      endDate: dateRangeDto.endDate,
      revenue,
      expenses,
      profit,
    };
  }

  async getByProject(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: BigInt(projectId), deletedAt: null },
      include: {
        department: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const revenues = await this.prisma.revenueRecord.findMany({
      where: { projectId: BigInt(projectId), deletedAt: null },
    });

    const totalRevenue = revenues.reduce(
      (sum, rev) => sum + Number(rev.amount),
      0,
    );
    const totalExpenses = revenues.reduce(
      (sum, rev) => sum + Number(rev.expense),
      0,
    );

    return {
      id: project.id.toString(),
      name: project.name,
      department: project.department?.name,
      revenue: totalRevenue,
      profit: totalRevenue - totalExpenses,
      status: project.status,
    };
  }

  async getByDepartment(departmentId?: number) {
    const where: any = { deletedAt: null };

    if (departmentId) {
      where.departmentId = BigInt(departmentId);
    }

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        department: true,
        revenueRecords: {
          where: { deletedAt: null },
        },
      },
    });

    const deptMap = new Map<
      string,
      { name: string; revenue: number; percentage: number }
    >();

    let totalRevenue = 0;

    projects.forEach((project) => {
      const deptName = project.department?.name || 'Unknown';
      const projectRevenue = project.revenueRecords.reduce(
        (sum, rev) => sum + Number(rev.amount),
        0,
      );

      totalRevenue += projectRevenue;

      const existing = deptMap.get(deptName) || {
        name: deptName,
        revenue: 0,
        percentage: 0,
      };
      deptMap.set(deptName, {
        ...existing,
        revenue: existing.revenue + projectRevenue,
      });
    });

    const result = Array.from(deptMap.values()).map((dept) => ({
      ...dept,
      percentage:
        totalRevenue > 0
          ? Number(((dept.revenue / totalRevenue) * 100).toFixed(2))
          : 0,
    }));

    if (departmentId) {
      return result[0] || { revenue: 0, percentage: 0 };
    }

    return result;
  }

  private formatRevenue(revenue: any) {
    return {
      id: revenue.id.toString(),
      projectId: revenue.projectId.toString(),
      projectName: revenue.project?.name,
      amount: Number(revenue.amount),
      expense: Number(revenue.expense),
      profit: Number(revenue.profit),
      periodStart: revenue.periodStart,
      periodEnd: revenue.periodEnd,
      description: revenue.description,
      recordedAt: revenue.recordedAt,
    };
  }
}
