import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from '../role/role.model';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    RoleModule,
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
    }),
  ],
  exports: [UserService],
})
export class UsersModule {}
