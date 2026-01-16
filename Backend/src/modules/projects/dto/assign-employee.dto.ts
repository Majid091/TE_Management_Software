import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class AssignEmployeeDto {
  @IsNumber()
  employeeId: number;

  @IsString()
  role: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  allocationPercentage?: number;
}
