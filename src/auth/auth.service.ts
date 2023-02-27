import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.models';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { userSuperAdmin } from 'helpers/admin-data';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { RolesService } from 'src/roles/roles.service';
import { UserRole } from 'src/roles/roles.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async refresh(refreshToken: string) {
    const user = await this.validateRefreshToken(refreshToken);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with that email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return await this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '24h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '60d' }),
    };
  }

  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Uncorrect email or password' });
  }

  private async validateRefreshToken(token: string) {
    const user = this.jwtService.verify(token);
    return user;
  }

  async createUserSuperAdmin(userSuperAdminData: CreateUserDto, roleSuperAdmin: CreateRoleDto) {
    roleSuperAdmin = {
      role: UserRole.SuperAdmin,
      description: 'Create and assign admin roles'
    }
    if (await this.rolesService.getRoleByValue(UserRole.SuperAdmin)) {
      throw new HttpException(
        'SuperAdmin already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.rolesService.createRole(roleSuperAdmin)
    userSuperAdminData = userSuperAdmin;
    await this.registration(userSuperAdminData)
    const user = await this.userService.getUserByEmail(userSuperAdminData.email)
    await user.update({
      roleId: role.id,
      role: role,
    })
    return user
  }
}
