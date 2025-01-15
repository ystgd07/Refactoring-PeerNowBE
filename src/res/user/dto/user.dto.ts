import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user123', description: '사용자 아이디' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  pw!: string;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateUserDto extends CreateUserDto {
  @IsOptional()
  id!: string;

  @IsOptional()
  pw!: string;

  @IsOptional()
  name!: string;
} 