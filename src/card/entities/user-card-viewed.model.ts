import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { Card } from './card.model';

@Table({tableName: 'user_cards_favorites', createdAt: false, updatedAt: false})
export class UserCardsViewed extends Model<UserCardsViewed> {

    @ForeignKey(() => Card)
    @Column({type: DataType.UUID})
    cardId: string;

    @ForeignKey(() => User)
    @Column({type: DataType.UUID})
    userId: string;
}