import { PickType } from '@nestjs/swagger';
import { User } from 'src/users/user.models';

export const responseSuperAdminFields = ['id', 'email', 'name', 'fullname', 'idRole']

export class ResponseSuperAdminDto extends PickType(User, responseSuperAdminFields as readonly (keyof User)[]) {}