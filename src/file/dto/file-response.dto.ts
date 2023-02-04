import { IsNumber, IsString } from 'class-validator';


export class FileResponseDto {

  @IsString({message: 'should be string'})
  readonly name: string;
  @IsString({message: 'should be string'})
  readonly url: string;
}