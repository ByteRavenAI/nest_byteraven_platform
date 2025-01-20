import { Injectable } from '@nestjs/common';

import { fromEnv } from '@aws-sdk/credential-providers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';

const configAwsRegion = process.env.AWS_REGION || 'ap-south-1';

export interface IS3UploadedFileInfoInterface {
  fileName: string;
  bucketName: string;
  url: string;
}

// Initialize S3 client
const s3Client = new S3Client({
  region: configAwsRegion,
  credentials: fromEnv(),
});

@Injectable()
export class AwsService {
  constructor() {}

  async uploadFileToS3Service(
    bucketName: string,
    file: Express.Multer.File,
    fileName: string, // contains folder + file name + extension eg. orgId/courses/courseId/module/moduleId/chapter/filename.mp3
  ): Promise<IS3UploadedFileInfoInterface | null> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        params: params,
        tags: [],
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false,
      });

      // parallelUploads3.on("httpUploadProgress", (progress) => {
      //   logger.info(`Upload progress: ${progress.loaded}/${progress.total}`);
      // });

      await parallelUploads3.done();
      return {
        fileName: fileName,
        bucketName: bucketName,
        url: `https://s3.${configAwsRegion}.amazonaws.com/${bucketName}/${fileName}`,
      };
    } catch (err) {
      return null;
    }
  }

  // https://s3.ap-south-1.amazonaws.com/prod.platform.byteraven/organisations/66a775c9107e90a2dfdb59c4/resumebuilds/99YlruppltaYxSBWCLNflLCFkmC3/6c00d97b-5775-45df-b574-c8a66f31f39f.pdf
}
