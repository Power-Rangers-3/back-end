import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadFolder = `${process.cwd()}/uploads/`
    await ensureDir(uploadFolder)
    const path = `${uploadFolder}/${file.originalname}`
    await writeFile(path, file.buffer)
    return path
  }

  saveFile(path: string) {
    //создать модель, которая будет представлять модель файла (путь, время сщзд-я. автор)
    //ш
  }
}
