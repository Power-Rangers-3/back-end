import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/role/role.model';
import { CardService } from './card.service';
import { AddCardInFavoritesDto } from './dto/add-favorites.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { Role } from 'src/auth/roles-auth.decorator';
import { ResponseFavoritesCard } from './dto/response-favorites.dto';
import { Card } from './entities/card.model';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiOperation({ summary: 'creating new card (only for SuperAdmin, Admin)' })
  @ApiBearerAuth()
  @Role(UserRole.SuperAdmin, UserRole.Admin)
  @UseGuards(RolesGuard)
  @ApiResponse({ type: CreateCardDto })
  @Post()
  createCard(@Body() dto: CreateCardDto): Promise<Card> {
    return this.cardService.create(dto);
  }

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

  @ApiOperation({ summary: 'return list of sorted card by name' })
  @ApiResponse({ type: [Card] })
  @Get('/pagination/:amount')
  getSortedCardsForPagination(
    @Param('amount') amount: string,
    @Query('type') type: string,
  ): Promise<Card[]> {
    return this.cardService.getSortedCardsForPagination(amount, type);
  }

  @ApiOperation({ summary: 'add card in viewed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseFavoritesCard })
  @Put(':id/viewed')
  addViewed(
    @Param('id') idCard: string,
    @Body() dto: AddCardInFavoritesDto,
  ): Promise<ResponseFavoritesCard> {
    return this.cardService.addFavorites(idCard, dto);
  }
}
