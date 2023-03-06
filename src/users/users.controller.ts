import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.models';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewPassword } from './dto/refresh-password.dto';
import { RefreshPasswordRequest } from './dto/refresh-password-request.dto';
import { CurrentUser } from 'src/decorators/current-user';
import { RefreshPasswordAnswerCode } from './dto/refresh-password-answer-code';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({  })
  @ApiOperation({ summary: 'get information about user' })
  @ApiResponse({ status: 200, type: User })
  @Get('/info')
  getInfo(@CurrentUser('email') email: User['email']) {
    return this.userService.getUserInfo(email);
  }

  @ApiOperation({ summary: 'add one more role for user / only for admin' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @ApiOperation({ summary: 'update user password in personal account' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/refresh-password')
  refreshPassword(@Body() dto: NewPassword) {
    return this.userService.refreshPassword(dto);
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
  update(@Param('id') id: string, @Body() dto: Partial<UpdateUserDto>) {
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
