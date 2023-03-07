import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseFavoritesCard {
  @ApiProperty({
    example: '4261d9a-dfa3-4592-a6de-cafef64acea2',
    description: 'uniq user id',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: '4261d9a-dfa3-4592-a6de-cafef64acea2',
    description: 'uniq card id',
  })
  @IsNotEmpty()
  @IsString()
  cardId: string;
}
