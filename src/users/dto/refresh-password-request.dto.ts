import { ApiProperty } from '@nestjs/swagger';

export class RefreshPasswordRequest {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'requested users email',
  })
  email: string;
}
