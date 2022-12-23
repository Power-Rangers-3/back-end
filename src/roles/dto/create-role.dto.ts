import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({example: 'ADMIN', description: 'single or couple of roles for user'})
  readonly value: string;
  @ApiProperty({example: 'this is USER', description: 'description for the roles of user'})
  readonly description: string;
}
