import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
