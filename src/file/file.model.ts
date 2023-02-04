import { ApiProperty } from '@nestjs/swagger';
import { Table, Model, Column, DataType, ForeignKey, CreatedAt, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/user.models';

interface FileCreationAttr {
  name: string,
  path: string,
  url: string,
  userId: number,
}

@Table({tableName: 'files'})
export class File extends Model<File, FileCreationAttr> {

  @ApiProperty({example: '1', description: 'uniq id'})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({example: '/app/uploads/1564314090_3.jpeg', description: 'local file path'})
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string

  @ApiProperty({example: 'https://townsend/file/1564314090_3.jpeg', description: 'file URL'})
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}

