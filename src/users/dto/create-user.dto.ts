import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'oleg',
    description: 'name of user',
  })
  @IsString({ message: 'should be string' })
  readonly name: string;

  @ApiProperty({
    example: 'Orlov',
    description: 'name of user',
  })
  @IsString({ message: 'should be string' })
  readonly fullname: string;

  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'uniq users email',
  })
  @IsString({ message: 'should be string' })
  @IsEmail({}, { message: 'incorrect email' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'non uniq password' })
  @IsString({ message: 'should be string' })
  @IsNotEmpty()
  @Length(4, 16, { message: 'incorrect length (more than 4, less than 16)' })
  readonly password: string;
}
