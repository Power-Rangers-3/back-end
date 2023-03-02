import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.models';

interface RoleCreationAttr {
  role: UserRole;
  description: string;
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User',
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttr> {
  @ApiProperty({ example: '24261d9a-dfa3-4592-a6de-cafef64acea2', description: 'uniq id' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({
    example: 'SuperAdmin/Admin/User',
    description: 'uniq role for users',
  })
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserRole),
    unique: true,
    allowNull: false,
  })
  role: UserRole;

  @ApiProperty({
    example: 'SuperAdministrator/basic User/some kind of Administrator',
    description: 'description of role',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @HasMany(() => User)
  users: User[];
}
