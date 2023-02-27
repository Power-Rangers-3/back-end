import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/roles/roles.model';

export class AddRoleDto {
  @ApiProperty({
    example: 'Moderator',
    description: 'uniq or multiple role for users',
  })
  readonly role: UserRole;
  
  @ApiProperty({ example: '1', description: 'uniq users id' })
  readonly userId: string;
}
