import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../role.model';

export class CreateRoleDto {
  @ApiProperty({
    example: 'SuperAdmin/Admin/User',
    description: 'role for user',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({
    example: 'this is the most powerful maan in the world',
    description: 'user role description',
  })
  @IsNotEmpty()
  readonly description: string;
}
