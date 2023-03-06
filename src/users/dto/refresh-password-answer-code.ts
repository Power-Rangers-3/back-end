import { ApiProperty } from '@nestjs/swagger';

export class RefreshPasswordAnswerCode {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'requested users email',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'secret to request change password',
  })
  secret: string;

  @ApiProperty({
    example: 'abc123',
    description: 'new Password',
  })
  pass: string;
}
