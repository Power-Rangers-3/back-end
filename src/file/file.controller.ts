import { Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileElementResponse } from './dto/file-element.response';
import { SaveFileDto } from './dto/save-file.dto';
import { ApiFile } from './api-file.decorator';

@ApiTags('Upload file')
@Controller('file')

export class FileController {
  constructor(
    private readonly filesService: FileService
  ) {}

  @ApiOperation({summary: 'Upload file (image)'})
  @Post('upload')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({status: 200, type: FileElementResponse})
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse> {
   const newFile: SaveFileDto = await this.filesService.uploadFile(file)
   return this.filesService.saveFile(newFile)
  }
}