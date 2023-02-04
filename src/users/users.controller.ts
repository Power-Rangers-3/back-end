import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./user.models";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { ValidationPipe } from "../pipes/validation.pipe";

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {}

  @ApiOperation({summary: 'creating user'})
  @ApiResponse({status: 200, type: User})
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    console.log("userDto", userDto)
    return this.userService.createUser(userDto);
  }

  @ApiOperation({summary: 'getting all users'})
  @ApiResponse({status: 200, type: [User]})
  @Get()
  getAll() {
    return this.userService.getALlUsers();
  }

  @ApiOperation({summary: 'add one more role for user / only for admin'})
  @ApiResponse({status: 200})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }
}
