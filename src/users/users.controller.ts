import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { Role } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewPassword } from './dto/refresh-password.dto';
import { CurrentUser } from 'src/decorators/current-user';
import { createResponseUserInfo } from 'helpers/response-get-user-info';
import { UserRole } from 'src/roles/roles.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get information about user' })
  @ApiResponse({ status: 200, type: createResponseUserInfo(User) })
  @Get('/info')
  getInfo(@CurrentUser('email') email: User['email']) {
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
    @CurrentUser('email') email: User['email']
    ) {
    return this.userService.refreshPassword(dto, email);
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
