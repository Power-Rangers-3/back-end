import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileElementResponse } from './dto/file-element.response';
import { SaveFileDto } from './dto/save-file.dto';
import { ApiFile } from './api-file.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user';
import { User } from 'src/user/user.model';

@ApiTags('Upload file')
@Controller('file')
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @ApiOperation({ summary: 'Upload file (image)' })
  @Post('upload')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, type: FileElementResponse })
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') id: User['id'],
  ): Promise<FileElementResponse> {
    const newFile: SaveFileDto = await this.filesService.uploadFile(file, id);
    return this.filesService.saveFile(newFile);
  }
}
