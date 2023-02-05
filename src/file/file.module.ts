import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.model'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
  imports: [
    SequelizeModule.forFeature([File]),
    forwardRef(()=> AuthModule)
  ],
})
export class FileModule {}
