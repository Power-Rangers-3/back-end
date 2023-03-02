import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class NewPassword {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'uniq users email',
  })
  @IsEmail({}, { message: 'incorrect email' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'non uniq password' })
  @IsString({ message: 'should be string' })
  @Length(4, 16, { message: 'incorrect length (more than 4, less than 16)' })
  @IsNotEmpty()
  readonly password: string;
  
  @ApiProperty({ example: 'password456', description: 'non uniq password' })
  @IsString({ message: 'should be string' })
  @Length(4, 16, { message: 'incorrect length (more than 4, less than 16)' })
  @IsNotEmpty()
  readonly newPassword: string;
}
