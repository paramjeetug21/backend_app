import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

export const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.S3_BUCKET,
    acl: 'private',
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      const filename = `${Date.now()}-${Math.random()}.${ext}`;
      cb(null, filename);
    },
  }),
});
