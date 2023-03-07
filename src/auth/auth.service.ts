import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { pick } from 'lodash';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { userSuperAdmin } from 'helpers/admin-data';
import { RolesService } from 'src/roles/roles.service';
import { roleAdminData, roleSuperAdminData, roleUserData } from 'helpers/roles';

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

  async createRolesAndSuperAdmin(): Promise<User> {
    const roles = await Promise.all([
      this.rolesService.findOrCreate(roleSuperAdminData),
      this.rolesService.findOrCreate(roleAdminData),
      this.rolesService.findOrCreate(roleUserData),
    ]);
    const roleSuperAdmin = roles[0];
    console.log('roles', roles);
    
    await this.registration(userSuperAdmin);
    const superAdmin = await this.userService.getUserByEmail(userSuperAdmin.email);
    await superAdmin.update({
      idRole: roleSuperAdmin.id,
      role: roleSuperAdmin,
    });
    return superAdmin.toJSON();
  }

  filterResponse(model: User, fields: string[]): Partial<User> {
    return pick(model, fields)
  }
}
