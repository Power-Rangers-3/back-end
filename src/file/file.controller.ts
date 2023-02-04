import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';
import { FileResponseDto } from './dto/file-response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { File } from './file.model'
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('Upload file')
@Controller('file')

export class FileController {
  constructor(
    private readonly filesService: FileService
  ) {}

  @ApiOperation({summary: 'Upload file (image)'})
  // @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileUploadDto> {

    return this.filesService.uploadFile(file)
  }
}
// метод сохранения в бд путь загруженного файла
// вернуть запись о результате сохр-я