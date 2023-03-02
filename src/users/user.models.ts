import {
  BelongsTo,
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

interface UserCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttr> {
  @ApiProperty({ example: '1', description: 'uniq id' })
  @Column({
    type: DataType.STRING,
    unique: true,
    autoIncrement: true,
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

  @ApiProperty({ example: '1', description: 'id role' })
  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING })
  idRole: string;

  @BelongsTo(() => Role)
  role: Role;

  @HasOne(() => File)
  file?: File[];
}
