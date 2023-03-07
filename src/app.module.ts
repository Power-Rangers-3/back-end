import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';
import { File } from './file/file.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { CardModule } from './card/card.module';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, File],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CardModule,
    // FileModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
