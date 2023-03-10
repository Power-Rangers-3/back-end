import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.model';
import { Role } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewPassword } from './dto/refresh-password.dto';
import { RefreshPasswordRequest } from './dto/refresh-password-request.dto';
import { CurrentUser } from 'src/decorators/current-user';
import { UserRole } from 'src/role/role.model';
import { ResponseGetInfoDto } from './dto/response-get-info.dto';
import { RefreshPasswordAnswerCode } from './dto/refresh-password-answer-code';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get information about user' })
  @ApiResponse({ status: 200, type: ResponseGetInfoDto })
  @Get('/info')
  getInfo(@CurrentUser('email') email: User['email']): Promise<Partial<User>> {
    return this.userService.getUserInfo(email);
  }

  @ApiOperation({ summary: 'add role for user / only for SuperAdmin' })
  @ApiBearerAuth()
  @Role(UserRole.SuperAdmin)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @ApiResponse({ status: 200, type: AddRoleDto })
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @ApiOperation({ summary: 'update user password in personal account' })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '{ message: "success" }' })
  @Post('/refresh-password')
  refreshPassword(
    @Body() dto: NewPassword,
    @CurrentUser('email') email: User['email'],
  ) {
    return this.userService.refreshPassword(dto, email);
  }

  @ApiOperation({ summary: 'send address to get email' })
  @ApiResponse({ status: 200 })
  @Post('/refresh-password-request')
  refreshPasswordRequestMail(@Body() dto: RefreshPasswordRequest) {
    return this.userService.refreshPasswordRequest(dto);
  }

  @ApiOperation({ summary: 'send secret and email to change password' })
  @ApiResponse({ status: 200 })
  @Post('/refresh-password-answer-code')
  refreshPasswordAnswerCode(@Body() dto: RefreshPasswordAnswerCode) {
    return this.userService.refreshPasswordAnswerCode(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update user data' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/update')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateUserDto>,
  ): Promise<Partial<UpdateUserDto>> {
    return this.userService.updateUser(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete user field data' })
  @ApiBody({ enum: ['phone', 'telegram', 'name', 'fullname'] })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id/delete')
  delete(@Param('id') id: string, @Body() field: string) {
    return this.userService.deleteUserField(id, field);
  }
}
