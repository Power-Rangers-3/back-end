import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.model'

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
  imports: [
    SequelizeModule.forFeature([File])
  ],
})
export class FileModule {}
