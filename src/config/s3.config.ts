import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3ConfigService {
  private readonly s3Client: S3Client;
  public readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const AWS_REGION = this.configService.get<string>('AWS_REGION');
    const AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const AWS_S3_BUCKET_NAME = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET_NAME) {
      console.error('Missing AWS configuration:', {
        region: !!AWS_REGION,
        accessKey: !!AWS_ACCESS_KEY_ID,
        secretKey: !!AWS_SECRET_ACCESS_KEY,
        bucketName: !!AWS_S3_BUCKET_NAME,
      });
      throw new Error('AWS 환경 변수가 설정되지 않았습니다.');
    }

    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = AWS_S3_BUCKET_NAME;
  }

  getS3Client(): S3Client {
    return this.s3Client;
  }

  getBucketName(): string {
    return this.bucketName;
  }
} 