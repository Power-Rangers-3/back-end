import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileElementResponse } from './dto/file-element.response';
import { SaveFileDto } from './dto/save-file.dto';

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
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse> {
   const newFile: SaveFileDto = await this.filesService.uploadFile(file)
   return this.filesService.saveFile(newFile)
  }
}