import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.model';
import { File } from './file/file.model';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.model';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { CardModule } from './card/card.module';
import { UserCardFavorites } from './card/entities/user-card-favorites.model';
import { UserCardViewed } from './card/entities/user-card-viewed.model';
import { Card } from './card/entities/card.model';

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
      models: [User, Role, File, Card, UserCardFavorites, UserCardViewed],
      autoLoadModels: true,
    }),
    UsersModule,
    RoleModule,
    AuthModule,
    CardModule,
    // FileModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
