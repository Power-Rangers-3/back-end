import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/roles/roles.model';

export class AddRoleDto {
  @ApiProperty({
    example: 'SuperAdmin',
    description: 'role for user',
  })
  readonly role: UserRole;
  
  @ApiProperty({ example: '2', description: 'uniq users id' })
  readonly userId: string;
}
