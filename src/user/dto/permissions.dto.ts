import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../user.model';

const fields = [
    'storageTimeForFavoriteCards',
    'numberOfFavoriteCards',
]
export class CustomPermissionSettingsDto extends PartialType(
    PickType(User, fields as readonly (keyof User)[]),
) {}