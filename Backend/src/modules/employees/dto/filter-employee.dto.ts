import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { EmployeeAvailability } from '../../../common/enums';

export class FilterEmployeeDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  department?: number;

  @IsOptional()
  @IsEnum(EmployeeAvailability)
  availability?: EmployeeAvailability;
}
