import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsNotEmpty } from 'class-validator';
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
  @IsNumberString()
  readonly userId: string;
}
