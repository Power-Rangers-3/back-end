import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}


}
