import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { randomUUID } from 'crypto'
import { InjectModel } from '@nestjs/sequelize';
import { File } from './file.model'
import { FileElementResponse } from './dto/file-element.response'
import { SaveFileDto } from './dto/save-file.dto';

@Injectable()
export class FileService {

  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  async uploadFile(file: Express.Multer.File, id: number): Promise<SaveFileDto> {
    const uploadFolder = `${process.cwd()}/uploads`
    await ensureDir(uploadFolder)
    const fileExtension = file.mimetype.split('/')[1]
    const hashNameFile = `${randomUUID()}.${fileExtension}`
    const path = `${uploadFolder}/${hashNameFile}`
    await writeFile(path, file.buffer)
    const urlHost = process.env.HOST || 'localhost'
    const urlPort = process.env.PORT || 5000
    const dataFile = {
      name: file.originalname,
      path,
      url: `${urlHost}:${urlPort}/file/${hashNameFile}`,
      userId: id
    }
    return dataFile
  }
  async saveFile(dataFile: SaveFileDto): Promise<FileElementResponse> {
    await this.fileRepository.create(dataFile)
    const response = {
      name: dataFile.name,
      url: dataFile.url
    }
    return response
  }
}
