import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileElementResponse {
  @ApiProperty({ example: '1564314090_3.jpeg', description: 'file name' })
  @IsString({ message: 'should be string' })
  readonly name: string;

  @ApiProperty({
    example: 'https://townsend/file/1564314090_3.jpeg',
    description: 'file URL',
  })
  @IsString({ message: 'should be string' })
  readonly url: string;
}
