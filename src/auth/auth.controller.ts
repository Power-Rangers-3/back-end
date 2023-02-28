import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Token } from './dto/create-auth.dto';
import { Response } from 'express';
import { Cookies } from 'src/decorators/cookies';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { User } from 'src/users/user.models';
import { createResponseUserInfo } from 'helpers/response-get-user-info';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    ) {}

  @ApiOperation({ summary: 'trying to login' })
  @ApiResponse({ status: 200, type: Token })
  @Post('/login')
  async login(
    @Body() userDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(userDto);

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { value: token.accessToken };
  }

  @ApiOperation({ summary: 'creating new account' })
  @ApiResponse({ status: 200, type: Token })
  @Post('/registration')
  async registration(
    @Res({ passthrough: true }) response: Response,
    @Body() userDto: CreateUserDto,
  ) {
    const token = await this.authService.registration(userDto);
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { value: token.accessToken };
  }

  @ApiOperation({ summary: 'refresh token' })
  @ApiResponse({ status: 200, type: Token })
  @Get('/refresh')
  async refresh(
    @Cookies() cookies,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.refresh(cookies.refreshToken);

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { value: token.accessToken };
  }

  @ApiOperation({ summary: 'creating SuperAdmin (for development)' })
  @ApiResponse({ status: 200, type: createResponseUserInfo(User)})
  @Post('/superadmin')
  async createUserWithRoleSuperAdmin(userAdmin: CreateUserDto, roleAdmin: CreateRoleDto): Promise<User> {
    return await this.authService.createUserSuperAdmin(userAdmin, roleAdmin)
  }
}