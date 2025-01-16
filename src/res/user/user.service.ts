import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { S3ConfigService } from '../../config/s3.config';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from '@aws-sdk/client-s3';
import { UserWithImageUrl } from './interfaces/user-with-image.interface';

@Injectable()
export class UserService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private s3ConfigService: S3ConfigService,
  ) {
    this.s3Client = this.s3ConfigService.getS3Client();
    this.bucketName = this.s3ConfigService.getBucketName();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateImage(id: string, file: Express.Multer.File): Promise<UserWithImageUrl> {
    const user = await this.findOne(id);

    if (user.image) {
      try {
        const oldKey = user.image.split('/').pop();
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: `profiles/${oldKey}`,
          })
        );
      } catch (error: any) {
        console.error('기존 S3 이미지 삭제 실패:', error.message);
      }
    }

    const fileKey = `profiles/${Date.now()}-${file.originalname}`;
    
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      
      user.image = fileKey;
      const savedUser = await this.userRepository.save(user);
      
      return {
        ...savedUser,
        imageUrl: signedUrl
      };
    } catch (error: any) {
      throw new Error(`이미지 업로드 실패: ${error.message}`);
    }
  }

  async getImageUrl(imageKey: string): Promise<string> {
    try {
      const key = imageKey.startsWith('profiles/') ? imageKey : `profiles/${imageKey}`;
      
      console.log('Generating pre-signed URL for key:', key);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error: any) {
      console.error('이미지 URL 생성 중 에러:', error);
      throw new Error(`이미지 URL 생성 실패: ${error.message}`);
    }
  }
}
