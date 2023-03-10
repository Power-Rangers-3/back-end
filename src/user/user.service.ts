import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class UserService{
  // private secretWord = '';

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
      throw new HttpException('User is not found', HttpStatus.UNAUTHORIZED);
    }
    if (email !== dto.email) {
      throw new HttpException('Incorrect email', HttpStatus.UNAUTHORIZED);
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!userDto) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    await user.update(userDto);
    const {password, ...userData} = user.toJSON();
    return userData;
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

// ****************************
  async refreshPasswordRequest(dto: RefreshPasswordRequest) {
    let correctMail = '';
    let secretWord = '';

    // const users = await this.userRepository.findAll();
    // console.log(users.da);

    try {
      const mail = await this.getUserByEmail(dto.email);
      correctMail = mail.email ? mail.email: 'There is not such email 001'
      const emailConfig: nodemailer.SentMessageInfo = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }

      const secretWord0 =Math.floor(Math.random() * 1000000);
      secretWord = secretWord0 > 100000 ? String(secretWord0) : String(secretWord0 + 100000);
      const emailService = new EmailService(process.env.HTTP_FRONT, emailConfig);
      await emailService.sendPasswordResetEmail(dto.email, secretWord);
    } catch (err) {
      console.log(err);
      correctMail = "There is no such email 002";
    }

    const recordLine: IWaitListLine = {
      email: dto.email,
      secret: secretWord,
      answerDate: new Date().getTime(),
      count: 0,
    };
    // !!!!!????????? Do you Remove all lists except current?
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
    let isCorrectEmail = false;
    let isCorrectSecret = false;
    let isEmailInList = false;
    let isTimeWell = false;
    let user: User;
    // let isLineInWaitList = false;
    // let is
    // try {
    //   // check if the email exists in DB
    //   console.log(dto);
    //   const a = await this.getUserByEmail(dto.email);
    //   isCorrectEmail = a.email === dto.email;
    //
    // } catch (err) {
    //   throw new BadRequestException('Bad email', {cause: new Error(), description: 'There is not such email' });
    // }

    try {
      console.log(this.waitList);
      user = await this.getUserByEmail(dto.email);
      isCorrectEmail = user.email === dto.email;

      // const users = this.userRepository.findAll();
      // console.log(users);

      const lineInWaitList = this.waitList.find((item) => item.email === dto.email);

      if (lineInWaitList.email) {
        // check if the email exists in the queue array
        // isEmailInList = lineInWaitList.email === dto.email;
        // a check - is there enough time to change the password - delete the wrong line from the queue array
        isTimeWell = (((new Date().getTime()) - lineInWaitList.answerDate) / 60000) < 60;
        isCorrectSecret = dto.secret === lineInWaitList.secret;
      }
    } catch (err) {
      throw new BadRequestException('Something went wrong', {cause: new Error(), description: 'Your request is incorrect'});
    }


    if (!isCorrectEmail) throw new BadRequestException('Bad email', {cause: new Error(), description: 'There is not such email' });
    // if (!isEmailInList) throw new BadRequestException('Something went wrong', {cause: new Error(), description: 'There is no such email in the queue to change the pass'});
    if (!isTimeWell) throw new BadRequestException('Something went wrong', {cause: new Error(), description: 'Your request is too late'});
    if (!isCorrectSecret) throw new BadRequestException('Something went wrong', {cause: new Error(), description: 'Your secret is incorrect'});



    // if (this)



    // if (isCorrectEmail && isEmailInList && isTimeWell) {
    // }


    // change password
    // const user = await this.getUserByEmail(dto.email);
    // if (!user) {
    //   throw new HttpException('User is not found', HttpStatus.UNAUTHORIZED);
    // }
    // if (user.email !== dto.email) {
    //   throw new HttpException('Incorrect email', HttpStatus.UNAUTHORIZED);
    // }

    // console.log(`Check-box: ${isCorrectEmail} and isMailInList is ${isEmailInList}`);
    // console.log(isCorrectEmail);
    // console.log(isEmailInList);
    // console.log(isTimeWell);
    console.log(this.waitList);

// change password
    this.waitList = this.waitList.filter((item) => item.email !== dto.email);
    this.waitList = this.waitList.length ? this.waitList: [initWaitListLine];
    console.log('Password is changed');
    const hashPassword: string = await bcrypt.hash(dto.newPassword, 5);
    await user.update({password: hashPassword});

    return { user };
  }
}
