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
import { RefreshPasswordRequest } from './dto/refresh-password-request.dto';
import { SentMessageInfo } from 'nodemailer';
import { EmailService } from './helpers/email-service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue('USER');
    if (role) {
      await user.$set('roles', [role.id]);
      user.roles = [role];
    }
    return user;
  }

  async refreshPassword(dto: NewPassword) {
    const user = await this.getUserByEmail(dto.email);
    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (user && passwordEquals) {
      const hashPassword: string = await bcrypt.hash(dto.newPassword, 5);
      user.password = hashPassword;
    }
  }

  async refreshPasswordRequest(dto: RefreshPasswordRequest) {
    let correctMail = '';
    try {
      const mail = (await this.getUserByEmail(dto.email)).email;
      correctMail = mail ? mail : "There is no such email";
      const emailConfig: SentMessageInfo = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'power.rangers.backend@gmail.com',
          password: 'zqYS9fK4mLyw4Xn',
        },
      }
      const emailService = new EmailService('https://your-app.com', emailConfig);
      await emailService.sendPasswordResetEmail(dto.email, '123456');


    } catch (err) {
      console.log(err);
      correctMail = "There is no such email";
    }

    return correctMail;
  }

  async getUserInfo(token: string) {
    const userToken = token.split(' ')[1];
    const user = this.jwtService.verify(userToken);
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
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException('User or role do not found', HttpStatus.NOT_FOUND);
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
