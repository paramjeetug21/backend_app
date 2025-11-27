import { Multer } from 'multer';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';
import { minioClient } from '../minio/minio.clints';

@Injectable()
export class FileService implements OnModuleInit {
  bucket = 'documents';

  // Runs when the module initializes
  async onModuleInit() {
    try {
      const exists = await minioClient.bucketExists(this.bucket);
      if (!exists) {
        await minioClient.makeBucket(this.bucket, 'us-east-1'); // region can be any string
        console.log(`Bucket "${this.bucket}" created successfully`);
      } else {
        console.log(`Bucket "${this.bucket}" already exists`);
      }
    } catch (err) {
      console.error('Error checking/creating bucket:', err);
    }
  }

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
