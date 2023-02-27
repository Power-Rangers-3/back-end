import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.models';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    RolesModule,
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
