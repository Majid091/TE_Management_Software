import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { CreateRevenueDto, UpdateRevenueDto, DateRangeDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@Controller('revenue')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createRevenueDto: CreateRevenueDto) {
    return this.revenueService.create(createRevenueDto);
  }

  @Get()
  findAll() {
    return this.revenueService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.revenueService.getSummary();
  }

  @Get('monthly')
  getMonthly(@Query('year', ParseIntPipe) year?: number) {
    return this.revenueService.getMonthly(year);
  }

  @Get('yearly')
  getYearly() {
    return this.revenueService.getYearly();
  }

  @Get('range')
  getByDateRange(@Query() dateRangeDto: DateRangeDto) {
    return this.revenueService.getByDateRange(dateRangeDto);
  }

  @Get('project/:id')
  getByProject(@Param('id', ParseIntPipe) id: number) {
    return this.revenueService.getByProject(id);
  }

  @Get('department/:id?')
  getByDepartment(@Param('id', ParseIntPipe) id?: number) {
    return this.revenueService.getByDepartment(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.revenueService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRevenueDto: UpdateRevenueDto,
  ) {
    return this.revenueService.update(id, updateRevenueDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.revenueService.remove(id);
  }
}
