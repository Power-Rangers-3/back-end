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
      console.log(`001 ${correctMail}`);
      const emailConfig: nodemailer.SentMessageInfo = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        // secure: process.env.SMTP_SECURE,
        // requireTLS: true,
        // secure: false,
        // secureConnection: false,
        auth: {
          // type: 'login',
          // security: 'STARTTLS',
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        // tls: {
        //   // do not fail on invalid certs
        //   rejectUnauthorized: false,
        // },
        // tls: {
        //   ciphers:'SSLv3'
        // },
      }
      console.log(emailConfig);
      let transporter = nodemailer.createTransport(emailConfig);
      let message = {
        from: 'Sender Name <sender@example.com>',
        to: 'Recipient <recipient@example.com>',
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Hello to myself!',
        html: '<p><b>Hello</b> to myself!</p>'
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
      // const emailService = new EmailService('https://your-app.com', emailConfig);
      // await emailService.sendPasswordResetEmail(dto.email, '123456');
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
