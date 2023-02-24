import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        example: 'myemail@gmail.com',
        description: 'uniq users email',
      })
      @IsString({ message: 'should be string' })
      @IsEmail({}, { message: 'incorrect email' })
      readonly email: string;
    
      @ApiProperty({ example: 'password123', description: 'non uniq password' })
      @IsString({ message: 'should be string' })
      @Length(4, 16, { message: 'incorrect length (more than 4, less than 16)' })
      readonly password: string;
}