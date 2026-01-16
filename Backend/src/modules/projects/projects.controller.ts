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
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  FilterProjectDto,
  AssignEmployeeDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterProjectDto) {
    return this.projectsService.findAll(filterDto);
  }

  @Get('status/:status')
  getByStatus(@Param('status') status: string) {
    return this.projectsService.getByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  @Post(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  assignEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignEmployeeDto: AssignEmployeeDto,
  ) {
    return this.projectsService.assignEmployee(id, assignEmployeeDto);
  }

  @Delete(':id/remove-employee/:employeeId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  removeEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.projectsService.removeEmployee(id, employeeId);
  }
}
