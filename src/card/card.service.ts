import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { AddCardInFavoritesDto } from './dto/add-favorites.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { ResponseFavoritesCard } from './dto/response-favorites.dto';
import { Card } from './entities/card.model';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private cardRepository: typeof Card,
    private userService: UserService,
  ) {}

  async addFavorites(
    id: string,
    dto: AddCardInFavoritesDto,
  ): Promise<ResponseFavoritesCard> {
    const card = await this.cardRepository.findByPk(id);
    if (!card) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.getUserById(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await card.$add('usersFavorites', user.id);
    return { userId: dto.userId, cardId: id };
  }

  async addViewed(
    id: string,
    dto: AddCardInFavoritesDto,
  ): Promise<ResponseFavoritesCard> {
    const card = await this.cardRepository.findByPk(id);
    if (!card) {
      throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.getUserById(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await card.$add('usersViewed', user.id);
    return { userId: dto.userId, cardId: id };
  }

  async create(dto: CreateCardDto): Promise<Card> {
    const card = await this.cardRepository.create(dto)
    return card.toJSON()
  }
}
