import { ApiProperty } from "@nestjs/swagger";
import { IntegerDataType } from "sequelize";
import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "src/users/user.models";

@Table({ tableName: 'cards' })
export class Card extends Model<Card> {
    @ApiProperty({ example: '1', description: 'uniq id' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: IntegerDataType;

    @ApiProperty({ example: 'card name example', description: 'card name' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @ApiProperty({ example: 'card description example', description: 'card description' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @ApiProperty({ example: 'https://townsend/file/1564314090_3.png', description: 'card logo URL' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    logoUrl: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;
}
