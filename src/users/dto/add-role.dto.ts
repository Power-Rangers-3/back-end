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
  
  @ApiProperty({ example: '2', description: 'uniq users id' })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}
