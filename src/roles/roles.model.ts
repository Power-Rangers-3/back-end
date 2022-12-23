import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/user.models";
import { UserRoles } from "./user-roles.model";

interface RoleCreationAttr {
  value: string,
  description: string,
}

@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttr>{

  @ApiProperty({example: '1', description: 'uniq id'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 'ADMIN/USER/MANAGER', description: 'uniq roles for users'})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  value: string;

  @ApiProperty({example: 'Administrator/basic user/some kind of manager', description: 'description of role'})
  @Column({type: DataType.STRING, allowNull: false})
  description: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[]
}
