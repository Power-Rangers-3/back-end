import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async findOrCreate(dto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.find(dto.role)
    if (existingRole) {
      return existingRole;
    }
    return this.roleRepository.create(dto);
  }

  find(roleValue: UserRole): Promise<Role> {
    return this.roleRepository.findOne({
      where: { role: roleValue },
      include: { all: true },
    });
  }
}
