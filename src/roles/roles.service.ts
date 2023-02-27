import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue(role: UserRole) {
    const roleValue = await this.roleRepository.findOne({
      where: { role: role },
      include: { all: true },
    });
    return roleValue;
  }
}
