import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { ProjectStatus } from '../../../common/enums';

export class FilterProjectDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  department?: number;
}
