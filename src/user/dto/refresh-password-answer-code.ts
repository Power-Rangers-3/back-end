import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RefreshPasswordAnswerCode {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'requested users email',
  })
  @IsString({ message: 'It must be string' })
  @IsEmail({}, { message: 'email id incorrect' })
  readonly email: string;

  @ApiProperty({
    example: '123456',
    description: 'secret to request change password',
  })
  @IsString({ message: 'It must be string' })
  readonly secret: string;

  @ApiProperty({
    example: 'abc12345',
    description: 'new Password',
  })
  @IsString({ message: 'It must be string' })
  @Length(8, 20, {
    message: 'Password length must be between 8 and 20 characters',
  })
  readonly password: string;

  @ApiProperty({
    example: 'abc12345',
    description: 'new Password',
  })
  @IsString({ message: 'It must be string' })
  @Length(8, 20, {
    message: 'Password length must be between 8 and 20 characters',
  })
  readonly newPassword: string;
}
