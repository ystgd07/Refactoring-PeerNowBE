import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3ConfigService {
  private readonly s3Client: S3Client;
  public readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const AWS_REGION = this.configService.get<string>('AWS_REGION')?.trim();
    const AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID')?.trim();
    const AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY')?.trim();
    const AWS_S3_BUCKET_NAME = this.configService.get<string>('AWS_S3_BUCKET_NAME')?.trim();

    console.log('환경 변수 값:', {
      AWS_REGION,
      AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID ? '존재함' : '없음',
      AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY ? '존재함' : '없음',
      AWS_S3_BUCKET_NAME,
    });

    console.log('환경 변수 타입:', {
      AWS_REGION: typeof AWS_REGION,
      AWS_ACCESS_KEY_ID: typeof AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: typeof AWS_SECRET_ACCESS_KEY,
      AWS_S3_BUCKET_NAME: typeof AWS_S3_BUCKET_NAME,
    });

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