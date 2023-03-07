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
import { Role } from 'src/roles/roles.model';
import { File } from '../file/file.model';
import { Card } from 'src/card/entities/card.model';
import { UserCardsFavorites } from 'src/card/entities/user-card-favorites.model';
import { UserCardsViewed } from 'src/card/entities/user-card-viewed.model';

interface UserCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
  @ApiProperty({ example: '24261d9a-dfa3-4592-a6de-cafef64acea2', description: 'uniq id' })
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

  @ApiProperty({ example: '24261d9a-dfa3-4592-a6de-cafef64acea2', description: 'id role' })
  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, })
  idRole: string;

  @BelongsTo(() => Role)
  role: Role;

  @HasOne(() => File)
  file?: File[];

  @BelongsToMany(() => Card, () => UserCardsFavorites)
  cardsFavorites: User[];

  @BelongsToMany(() => Card, () => UserCardsViewed)
  cardsViewed: User[];
}
