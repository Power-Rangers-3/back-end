import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/role/role.model';
import { File } from '../file/file.model';
import { Card } from 'src/card/entities/card.model';
import { UserCardFavorites } from 'src/card/entities/user-card-favorites.model';
import { UserCardViewed } from 'src/card/entities/user-card-viewed.model';

interface UserCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
  @ApiProperty({
    example: '24261d9a-dfa3-4592-a6de-cafef64acea2',
    description: 'uniq id',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'uniq users email',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'password123', description: 'non uniq password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'Ivan', description: 'non uniq name' })
  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @ApiProperty({ example: 'Ivanov', description: 'non uniq surname' })
  @Column({ type: DataType.STRING, allowNull: true })
  fullname: string;

  @ApiProperty({
    example: 'https://t.me/@ivanov',
    description: 'uniq telegram address',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  telegram: string;

  @ApiProperty({ example: '+375291112233', description: 'uniq phone number' })
  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @ApiProperty({
    example: '24261d9a-dfa3-4592-a6de-cafef64acea2',
    description: 'id role',
  })
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID })
  idRole: string;

  @BelongsTo(() => Role)
  role: Role;

  @HasOne(() => File)
  file: File;

  @ApiProperty({
    example: 30,
    description: 'number of days to store cards in favorites, default value 30'
  })
  @Column({ type: DataType.INTEGER, defaultValue: 30 })
  storageTimeForFavoriteCards: number;

  @ApiProperty({
    example: 10,
    description: 'the number of cards a user can store in favorites, default value 10'
  })
  @Column({ type: DataType.INTEGER, defaultValue: 10 })
  numberOfFavoriteCards: number;

  @BelongsToMany(() => Card, () => UserCardFavorites)
  cardsFavorites: User[];

  @BelongsToMany(() => Card, () => UserCardViewed)
  cardsViewed: User[];
}
