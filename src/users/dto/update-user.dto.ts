import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'uniq users email',
    required: false,
  })
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'non uniq password',
    required: false,
  })
  @IsString({ message: 'should be string' })
  @Length(4, 16, { message: 'incorrect length (more than 4, less than 16)' })
  password: string;

  @ApiProperty({
    example: 'Ivan',
    description: 'user name',
    required: false,
  })
  readonly name: string | null;

  @ApiProperty({
    example: 'Ivanov',
    description: 'user surname',
    required: false,
  })
  @IsString({ message: 'should be string' })
  readonly fullname: string | null;

  @ApiProperty({
    example: '+375291234567',
    description: 'user phone',
    required: false,
  })
  @IsMobilePhone() 
  readonly phone: string | null;
  
  @ApiProperty({
    example: 'https://t.me/@ivanov',
    description: 'telegram address',
    required: false,
  })
  @IsUrl()
  readonly telegram: string | null;
}
