import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from '../role/role.service';
import { AddRoleDto } from './dto/add-role.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewPassword } from './dto/refresh-password.dto';
import { UserRole } from 'src/role/role.model';
import { RefreshPasswordRequest } from './dto/refresh-password-request.dto';
import { EmailService } from './helpers/email-service';
import * as nodemailer from 'nodemailer';
import { RefreshPasswordAnswerCode } from './dto/refresh-password-answer-code';
import { initWaitListLine, IWaitListLine } from '../models';


@Injectable()
export class UserService{
  private secretWord = '';

  private waitList: IWaitListLine[] = [initWaitListLine];

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RoleService,
  ) {
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.find(UserRole.User);
    if (role) {
      await user.$set('role', role.id);
      user.role = role;
    }
    return user;
  }

  async refreshPassword(dto: NewPassword, email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (email !== dto.email) {
      throw new UnauthorizedException();
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {
      throw new UnauthorizedException();
    }
    const hashPassword: string = await bcrypt.hash(dto.newPassword, 5);
    await user.update({password: hashPassword});
    return {message: 'success'};
  }

  async getUserInfo(email: string): Promise<Partial<User>> {
    const user = await this.getUserByEmail(email);
    const {password, ...userData} = user.toJSON();
    return userData;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {email},
      include: {all: true},
    });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: {id},
      include: {all: true},
    });
    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const role = await this.roleService.find(dto.role);
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    await user.update({
      idRole: role.id,
      role: role,
    });
    return dto;
  }

  async updateUser(
    id: string,
    userDto: Partial<UpdateUserDto>,
  ): Promise<Partial<UpdateUserDto>> {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!userDto) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    await user.update(userDto);
    const {password, ...userData} = user.toJSON();
    return userData;
  }

  async deleteUserField(id: string, userField: string) {
    const user = await this.userRepository.findByPk(+id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (userField.includes('password') || userField.includes('email'))
      throw new HttpException(
        'password or email not be deleted',
        HttpStatus.BAD_REQUEST,
      );
    user[userField] = null;
    await user.save();
    return user;
  }

// ****************************
  async refreshPasswordRequest(dto: RefreshPasswordRequest) {
    let correctMail = '';

    try {
      const mail = await this.getUserByEmail(dto.email);
      correctMail = mail.email ? mail.email: "There is not such email 001";
      const emailConfig: nodemailer.SentMessageInfo = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }

      this.secretWord = String(Math.floor(Math.random() * 1000000));

      const emailService = new EmailService(process.env.HTTP_FRONT, emailConfig);
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
    if (this.waitList[0].email == ' ') this.waitList.shift();
    console.log(this.waitList);

    return {correctMail};
  }

// ****************************
  async refreshPasswordAnswerCode(dto: RefreshPasswordAnswerCode) {
    // check if the email exists in DB
    console.log(dto);
    const a = await this.getUserByEmail(dto.email);
    const isCorrectEmail = a.email === dto.email;

    // check if the email exists in the queue array
    // if (this)

    console.log(this.waitList);

    const lineInWaitList = this.waitList.find((item) => item.email === dto.email);
    let isMailInList = false;
    let isTimeWell = false;
    if (lineInWaitList) {
      isMailInList = lineInWaitList.email === dto.email;
      // check if time is enough to change the password - delete the wrong line from the queue array
      isTimeWell = (((new Date().getTime()) - lineInWaitList.answerDate) / 60000) < 60;
    }

    if (isCorrectEmail && isMailInList && isTimeWell) {
      this.waitList = this.waitList.filter((item) => item.email !== dto.email);
      this.waitList = this.waitList.length ? this.waitList: [initWaitListLine];
    }


    // change password
    const user = await this.getUserByEmail(dto.email);
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.UNAUTHORIZED);
    }
    if (user.email !== dto.email) {
      throw new HttpException('Incorrect email', HttpStatus.UNAUTHORIZED);
    }

    console.log(`Check-box: ${isCorrectEmail} and isMailInList is ${isMailInList}`);
    console.log(isCorrectEmail);
    console.log(isMailInList);
    console.log(isTimeWell);
    console.log(this.waitList);

// change password
    const hashPassword: string = await bcrypt.hash(dto.newPassword, 5);
    await user.update({password: hashPassword});

    return user;
  }
}
