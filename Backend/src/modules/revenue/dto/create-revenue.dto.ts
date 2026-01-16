import { IsNumber, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRevenueDto {
  @IsNumber()
  projectId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  expense?: number;

  @Type(() => Date)
  @IsDate()
  periodStart: Date;

  @Type(() => Date)
  @IsDate()
  periodEnd: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
