import { OmitType } from '@nestjs/swagger';
import { User } from '../user.model';

export class UserDataResponseDto extends OmitType(User, ['password'] as const) {}