import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UserRole } from 'src/roles/roles.model';


export const roleSuperAdminData: CreateRoleDto = {
    role: UserRole.SuperAdmin,
    description: 'Create and assign admin roles'
}

export const roleAdminData: CreateRoleDto = {
    role: UserRole.Admin,
    description: 'Filling the site with data'
}

export const roleUserData: CreateRoleDto = {
    role: UserRole.User,
    description: 'Basic role of registered user'
}