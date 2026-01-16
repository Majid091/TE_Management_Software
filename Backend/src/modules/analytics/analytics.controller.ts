import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('employees')
  getEmployeeAnalytics() {
    return this.analyticsService.getEmployeeAnalytics();
  }

  @Get('projects')
  getProjectAnalytics() {
    return this.analyticsService.getProjectAnalytics();
  }

  @Get('departments')
  getDepartmentAnalytics() {
    return this.analyticsService.getDepartmentAnalytics();
  }

  @Get('trends')
  getTrends(@Query('type') type?: string, @Query('period') period?: string) {
    return this.analyticsService.getTrends();
  }
}
