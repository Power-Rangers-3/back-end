import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Role } from 'src/role/role.model';
import { User } from 'src/user/user.model';
import { File } from 'src/file/file.model';
import { Card } from 'src/card/entities/card.model';

const fields = ['password'];

export class ResponseGetInfoDto extends OmitType(
  User,
  fields as readonly (keyof User)[],
) {
  @ApiProperty({ example: '2023-02-24T21:04:36.879Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-02-24T21:04:36.879Z' })
  updatedAt: string;

  @ApiProperty({ type: Role })
  role: any;

  @ApiProperty({ type: File })
  file: any;

  @ApiProperty({ type: [Card] })
  cardsFavorites: [];

  @ApiProperty({ type: [Card] })
  cardsViewed: [];
}
