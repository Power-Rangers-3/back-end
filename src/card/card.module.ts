import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './entities/card.model';
import { User } from 'src/users/user.model';
import { UserCardsFavorites } from './entities/user-card-favorites.model';
import { UserCardsViewed } from './entities/user-card-viewed.model';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [
    SequelizeModule.forFeature([Card, User, UserCardsFavorites, UserCardsViewed])
  ],
  exports: [CardService],
})
export class CardModule {}
