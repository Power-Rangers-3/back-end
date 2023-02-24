import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({
    example: 'MANAGER',
    description: 'uniq or multiple role for users',
  })
  readonly value: string;
  @ApiProperty({ example: '1', description: 'uniq users id' })
  readonly userId: string;
}
