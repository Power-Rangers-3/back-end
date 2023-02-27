import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, UserRole } from './roles.model';


@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: 'creating role' })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({ summary: `check if user's role already exist` })
  @ApiResponse({ status: 200, type: [Role] })
  @Get('/:role')
  getByValue(@Param('role') role: UserRole) {
    return this.roleService.getRoleByValue(role);
  }
}
