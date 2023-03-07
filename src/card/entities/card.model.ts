import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, DataType, BelongsToMany } from "sequelize-typescript";
import { User } from "src/users/user.model";
import { UserCardsFavorites } from './user-card-favorites.model';
import { UserCardsViewed } from './user-card-viewed.model';

@Table({ tableName: 'cards' })
export class Card extends Model<Card> {
    @ApiProperty({ example: 'e934e638-6ba3-4fec-9be0-4e3318be3f1', description: 'uniq id' })
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        unique: true,
        primaryKey: true,
    })
    id: string;

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

    @BelongsToMany(() => User, () => UserCardsFavorites)
    usersFavorites: User[];

    @BelongsToMany(() => User, () => UserCardsViewed)
    usersViewed: User[];
}
