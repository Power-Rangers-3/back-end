import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    RoleModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
