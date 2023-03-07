import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, UserRole } from './role.model';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'creating role' })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roleService.findOrCreate(dto);
  }

  @ApiOperation({ summary: `check if user's role already exist` })
  @ApiResponse({ status: 200, type: [Role] })
  @Get('/:role')
  getByValue(@Param('role') role: UserRole): Promise<Role> {
    return this.roleService.find(role);
  }
}
