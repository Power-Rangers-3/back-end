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

  async create(dto: CreateCardDto): Promise<Card> {
    const card = await this.cardRepository.create(dto);
    return card.toJSON();
  }

  async getSortedCardsForPagination(amount, type): Promise<Card[]> {
    if (type === 'DESC') {
      if (amount < 1) {
        throw new HttpException(
          'Wrong amount of cards',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (amount === 1) {
        return this.cardRepository.findAll({
          offset: 0,
          limit: 10,
          order: [['name', 'DESC']],
        });
      } else {
        return this.cardRepository.findAll({
          offset: amount * 10 - 10,
          limit: 10,
          order: [['name', 'DESC']],
        });
      }
    } else if (type === 'ASC') {
      if (amount < 1) {
        throw new HttpException(
          'Wrong amount of cards',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (amount === 1) {
        return this.cardRepository.findAll({
          offset: 0,
          limit: 10,
          order: ['name'],
        });
      } else {
        return this.cardRepository.findAll({
          offset: amount * 10 - 10,
          limit: 10,
          order: ['name'],
        });
      }
    } else throw new HttpException('Wrong sorted type', HttpStatus.BAD_REQUEST);
  }
}
