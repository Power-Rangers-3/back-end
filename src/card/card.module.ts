import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
