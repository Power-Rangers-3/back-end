import { forwardRef, Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './entities/card.model';
import { User } from 'src/user/user.model';
import { UserCardFavorites } from './entities/user-card-favorites.model';
import { UserCardViewed } from './entities/user-card-viewed.model';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
    SequelizeModule.forFeature([Card, User, UserCardFavorites, UserCardViewed]),
  ],
  exports: [CardService],
})
export class CardModule {}
