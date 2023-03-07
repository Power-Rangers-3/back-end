import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ example: 'card name (title)', description: 'card name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'card description',
    description: 'card description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://townsend/file/1564314090_3.png',
    description: 'card logo URL',
  })
  @IsNotEmpty()
  @IsString()
  logoUrl: string;
}
