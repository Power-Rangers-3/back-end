import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'single or couple of roles for user',
  })
  readonly value: string;
  @ApiProperty({
    example: 'this is the most powerful maan in the world',
    description: 'description for the roles of user',
  })
  readonly description: string;
}
