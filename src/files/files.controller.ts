import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { Express } from 'express';

@Controller('file')

export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const path = await this.filesService.uploadFile(file)
    // метод сохранения в бд путь загруженного файла
    // вернуть запись о результате сохр-я
    return {}
  }
}
