import { IsEnum } from 'class-validator';
import { EmployeeAvailability } from '../../../common/enums';

export class UpdateAvailabilityDto {
  @IsEnum(EmployeeAvailability)
  availability: EmployeeAvailability;
}
