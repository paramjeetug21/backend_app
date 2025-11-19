import { Multer } from 'multer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { minioClient } from 'src/minio/minio.clints';

@Injectable()
export class FileService {
  bucket = 'documents';

  async uploadFile(file: Multer.File) {
    const fileKey = crypto.randomUUID() + '-' + file.originalname;

    await minioClient.putObject(this.bucket, fileKey, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return {
      key: fileKey,
      bucket: this.bucket,
      message: 'File uploaded successfully',
    };
  }

  async getSignedUrl(key: string) {
    const url = await minioClient.presignedGetObject(this.bucket, key, 60 * 60);
    return { url };
  }
}
