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
import { EmailService } from './helpers/email-service';
import * as nodemailer from 'nodemailer';
import { RefreshPasswordAnswerCode } from './dto/refresh-password-answer-code';
import { initWaitListLine, IWaitListLine } from '../models';

@Injectable()
export class UsersService {
  private secretWord = '';

  private waitList: IWaitListLine[] = [initWaitListLine];

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

  // ****************************
  async refreshPasswordRequest(dto: RefreshPasswordRequest) {
    let correctMail = '';

    try {
      const mail = await this.getUserByEmail(dto.email);
      correctMail = mail.email ? mail.email : "There is not such email 001";
      const emailConfig: nodemailer.SentMessageInfo = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }

      this.secretWord = String(Math.floor(Math.random() * 1000000));

      const emailService = new EmailService('https://your-app.com', emailConfig);
      await emailService.sendPasswordResetEmail(dto.email, this.secretWord);
    } catch (err) {
      console.log(err);
      correctMail = "There is no such email 002";
    }

    const recordLine: IWaitListLine = {
      email: dto.email,
      secret: this.secretWord,
      answerDate: new Date().getTime(),
    };
    this.waitList = this.waitList.filter((item) => {
      return item.email !== dto.email;
    });
    this.waitList.push(recordLine);
    if (this.waitList[0].email == '') this.waitList.shift();
    console.log(this.waitList);

    return { correctMail };
  }

  async refreshPasswordAnswerCode(dto: RefreshPasswordAnswerCode) {
    // check if the email exists in DB
    const a = await this.getUserByEmail(dto.email);
    const isCorrectEmail = a.email === dto.email;

    // check if the email exists in the queue array
    const b = this.waitList.find((item) => item.email === dto.email);
    const isMailInList = b.email === dto.email;
    // check if time is enough to change the password - delete the wrong line from the queue array
    const isTimeWell =(((new Date().getTime()) - b.answerDate) / 60000) < 60;

    if (isCorrectEmail && isMailInList && isTimeWell) {
      this.waitList = this.waitList.filter((item) => item.email !== dto.email);
      this.waitList = this.waitList.length ? this.waitList : [initWaitListLine];
    //  change password
    }



    console.log(`Check-box: ${isCorrectEmail} and isMailInList is ${isMailInList}`);
    console.log(isCorrectEmail);
    console.log(isMailInList);
    console.log(isTimeWell);
    console.log(this.waitList);
    return dto;
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
