import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { randomUUID } from 'crypto'
import { InjectModel } from '@nestjs/sequelize';
import { File } from './file.model'
import { FileUploadDto } from './dto/file-upload.dto';

@Injectable()
export class FileService {

  constructor(@InjectModel(File) private fileRepository: typeof File) {
    
  }

  async uploadFile(file: Express.Multer.File) {
    const uploadFolder = `${process.cwd()}/uploads`
    await ensureDir(uploadFolder)
    const fileExtension = file.mimetype.split('/')[1]
    const hashNameFile = `${randomUUID()}.${fileExtension}`
    const path = `${uploadFolder}/${hashNameFile}`
    await writeFile(path, file.buffer)
    const urlRrotocol = process.env.URL_PROTOCOL || 'http'
    const urlHostname = process.env.URL_HOSTNAME || 'localhost'
    const urlPort = process.env.PORT || 5000
    console.log(file.originalname)
    const dataFile: FileUploadDto = {
      path: path,
      url: `${urlRrotocol}://${urlHostname}:${urlPort}/file/${hashNameFile}`,
      userId: 1
    }
    return this.fileRepository.create(dataFile)
  }
}
