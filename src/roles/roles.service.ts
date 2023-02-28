import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto): Promise<Role> {
    if (!Object.values(UserRole).includes(dto.role)) {
      throw new HttpException(
      `Role can be ${Object.values(UserRole)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (await this.getRoleByValue(dto.role)) {
      throw new HttpException(
        'Role already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue(roleValue: UserRole): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role: roleValue },
      include: { all: true },
    });
    return role;
  }
}
