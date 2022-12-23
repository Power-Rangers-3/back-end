import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

interface UserCreationAttr {
  email: string,
  password: string,
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttr>{

  @ApiProperty({example: '1', description: 'uniq id'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 'myemail@gmail.com', description: 'uniq users email'})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  email: string;

  @ApiProperty({example: 'password123', description: 'non uniq password'})
  @Column({type: DataType.STRING, allowNull: false})
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[]

}
