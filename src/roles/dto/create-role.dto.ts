import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../roles.model';

export class CreateRoleDto {
  @ApiProperty({
    example: 'SuperAdmin/Admin/User',
    description: 'role for user',
  })
  readonly role: UserRole;

  @ApiProperty({
    example: 'this is the most powerful maan in the world',
    description: 'user role description',
  })
  readonly description: string;
}
