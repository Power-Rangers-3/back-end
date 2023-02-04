import { IsNumber, IsString } from 'class-validator';

export class FileUploadDto {

  @IsString({message: 'should be string'})
  readonly url: string;
  @IsString({message: 'should be string'})
  readonly path: string;
  @IsNumber()
  readonly userId: number;
}