import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/roles/roles.model';

export class AddRoleDto {
  @ApiProperty({
    example: 'SuperAdmin',
    description: 'role for user',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;
  
  @ApiProperty({ example: '4261d9a-dfa3-4592-a6de-cafef64acea2', description: 'uniq users id' })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}
