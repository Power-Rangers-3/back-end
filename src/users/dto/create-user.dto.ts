import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

  @ApiProperty({example: 'myemail@gmail.com', description: 'uniq users email'})
  readonly email: string;
  @ApiProperty({example: 'password123', description: 'non uniq password'})
  readonly password: string;
}
