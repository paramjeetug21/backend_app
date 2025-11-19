import { Multer } from 'multer'; // ✔ correct type import

import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get('signed-url')
  getSignedUrl(@Query('key') key: string) {
    return this.fileService.getSignedUrl(key);
  }
}
