import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus, ProjectPriority } from '../../../common/enums';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsNumber()
  departmentId: number;

  @IsNumber()
  managerId: number;

  @IsOptional()
  @IsString()
  client?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
