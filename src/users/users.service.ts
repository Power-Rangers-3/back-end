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
// import { SentMessageInfo } from 'nodemailer';
import { EmailService } from './helpers/email-service';
import * as nodemailer from 'nodemailer';

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
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {
      throw new HttpException('Incorrect password', HttpStatus.NOT_FOUND);
    }
    const hashPassword: string = await bcrypt.hash(dto.newPassword, 5);
    user.password = hashPassword;
  }

  async refreshPasswordRequest(dto: RefreshPasswordRequest) {
    let correctMail = '';
    try {
      const mail = await this.getUserByEmail(dto.email);
      correctMail = mail.email ? mail.email : "There is not such email 001";
      // console.log(`001 ${correctMail}`);
      const emailConfig: nodemailer.SentMessageInfo = {
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: false,
        // Port: 465 or 587
        // port: 465,
        // SSL: true,
        // Authentication: true,
        auth: {
          type: 'login',
          user: 'power.rangersbackend@yahoo.com',
          password: 'BfBfSCHPrsPLhb4',

          // host: 'sandbox.smtp.mailtrap.io',
          // port: 2525,
          // secure: true,
          // auth: {
          //   user: 'feb24e4289814c',
          //   password: '6f00d90273cb93',

        // service: 'gmail',
        // auth: {
        //   user: 'power.rangers.backend@gmail.com',
        //   pass: 'zqYS9fK4mLyw4Xn',
        },

      }
      // console.log(emailConfig);
      const emailService = new EmailService('https://your-app.com', emailConfig);
      await emailService.sendPasswordResetEmail(dto.email, '123456');
    } catch (err) {
      console.log(err);
      correctMail = "There is no such email 002";
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
