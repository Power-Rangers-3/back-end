import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SaveFileDto {

  @ApiProperty({example: '1564314090_3.jpeg', description: 'file name'})
  @IsString({message: 'should be string'})
  name: string;

  @ApiProperty({example: '/app/uploads/1564314090_3.jpeg', description: 'local file path'})
  @IsString({message: 'should be string'})
  path: string;

  @ApiProperty({example: 'https://townsend/file/1564314090_3.jpeg', description: 'file URL'})
  @IsString({message: 'should be string'})
  url: string;

  @IsNumber()
  userId: number;
}