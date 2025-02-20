import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ProjectMemberDto {
  @ApiProperty({ example: 'user1', description: '사용자 ID' })
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @ApiProperty({ example: 'TM', description: '프로젝트 내 역할' })
  @IsString()
  @IsNotEmpty()
  role!: string;
}

export class CreateProjectDto {
  @ApiProperty({ example: '프로젝트 제목', description: '프로젝트 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: '프로젝트 상세 내용',
    description: '프로젝트 상세 내용',
  })
  @IsString()
  @IsOptional()
  detail?: string;

  @ApiProperty({ example: '2024-03-21', description: '시작일' })
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ example: '2024-12-31', description: '종료일' })
  @IsString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    type: [ProjectMemberDto],
    description: '프로젝트 참여자 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members!: ProjectMemberDto[];
}
