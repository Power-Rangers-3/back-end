import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RefreshPasswordRequest {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'requested users email',
  })
  @IsEmail({}, {message: 'Email is incorrect'})
  @IsString({message: 'Email must be string'})
  readonly email: string;
}
