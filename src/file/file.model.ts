import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/user.models';

@Table({ tableName: 'files' })
export class File extends Model<File> {
  @ApiProperty({ example: '24261d9a-dfa3-4592-a6de-cafef64acea2', description: 'uniq id' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ example: '1564314090_3.jpeg', description: 'name file' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: '/app/uploads/1564314090_3.jpeg',
    description: 'local file path',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @ApiProperty({
    example: 'https://townsend/file/1564314090_3.jpeg',
    description: 'file URL',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
