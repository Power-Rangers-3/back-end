import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CardService } from './card.service';
import { AddCardInFavoritesDto } from './dto/add-favorites.dto';
import { ResponseFavoritesCard } from './dto/response-favorites.dto';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiOperation({ summary: 'add card in favorites' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseFavoritesCard })
  @Put(':id/favorites')
  addFavorites(
    @Param('id') idCard: string,
    @Body() dto: AddCardInFavoritesDto,
  ): Promise<ResponseFavoritesCard> {
    return this.cardService.addFavorites(idCard, dto);
  }
}
