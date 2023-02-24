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
import { CreateUserDto } from './dto/create-user.dto';
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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get information about user' })
  @Get('/info')
  getInfo(@Headers('Authorization') token: string) {
    return this.userService.getUserInfo(token);
  }

  @ApiOperation({ summary: 'add one more role for user / only for admin' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

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

  // @Post('/refresh-password-answer-code')
  // refreshPasswordAnswerCode(@Body() dto: NewPassword) {
  //   return this.userService.refreshPassword(dto);
  // }

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
