import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // ✔ REQUIRED FOR MINIO!
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
