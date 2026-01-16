import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeAvailability, UserRole } from '../../../common/enums';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  position: string;

  @IsNumber()
  departmentId: number;

  @IsOptional()
  @IsEnum(EmployeeAvailability)
  availability?: EmployeeAvailability;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hireDate?: Date;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsNumber()
  managerId?: number;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
