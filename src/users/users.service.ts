import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.models';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { NewPassword } from './dto/refresh-password.dto';
import { UserRole } from 'src/roles/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);  
    const role = await this.roleService.getRoleByValue(UserRole.User);
    if (role) {
      await user.$set('role', role.id);
      user.role = role;
    }
    return user;
  }

  async refreshPassword(dto: NewPassword, email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    if (email !== dto.email) {
      throw new HttpException('Incorrect email', HttpStatus.NOT_FOUND);
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {
      throw new HttpException('Incorrect password', HttpStatus.NOT_FOUND);
    }
    const hashPassword: string = await bcrypt.hash(dto.newPassword, 5);
    await user.update({ password: hashPassword });
    return { message: 'success' };
  }

  async getUserInfo(email: string) {
    const user = await this.getUserByEmail(email);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const role = await this.roleService.getRoleByValue(dto.role);
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    await user.update({
      idRole: role.id,
      role: role,
    })
    return dto;
  }

  async updateUser(id: string, userDto: Partial<UpdateUserDto>) {
    const user = await this.userRepository.findByPk(+id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!userDto) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    if (userDto.password)
      userDto.password = await bcrypt.hash(userDto.password, 5);
    await user.update(userDto);
    return user;
  }

  async deleteUserField(id: string, userField: string) {
    const user = await this.userRepository.findByPk(+id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (userField.includes('password') || userField.includes('email'))
      throw new HttpException(
        'password or email not be deleted',
        HttpStatus.BAD_REQUEST,
      );
    user[userField] = null;
    await user.save();
    return user;
  }
}
