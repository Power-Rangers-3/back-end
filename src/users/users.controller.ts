import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'creating user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get information about user' })
  @Get('/info')
  gettest(@Headers('Authorization') token: string) {
    return this.userService.getUserInfo(token);
  }

  @ApiOperation({ summary: 'getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.userService.getALlUsers();
  }

  @ApiOperation({ summary: 'add one more role for user / only for admin' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
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
