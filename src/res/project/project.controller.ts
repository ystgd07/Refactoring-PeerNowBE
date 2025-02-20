import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectWithMembers } from './interfaces/project-with-members.interface';

@ApiTags('projects')
@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: '프로젝트 생성' })
  @ApiResponse({ status: 201, description: '프로젝트가 생성되었습니다.' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 프로젝트 조회' })
  findAll() {
    return this.projectService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자의 프로젝트 조회' })
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<ProjectWithMembers[]> {
    try {
      const projects = await this.projectService.findByUserId(userId);
      return projects;
    } catch (error) {
      console.error('프로젝트 조회 중 에러 발생:', error);
      throw error;
    }
  }

  @Get(':no')
  @ApiOperation({ summary: '특정 프로젝트 조회' })
  findOne(@Param('no', ParseIntPipe) no: number) {
    return this.projectService.findOne(no);
  }

  @Put(':no')
  @ApiOperation({ summary: '프로젝트 수정' })
  update(
    @Param('no', ParseIntPipe) no: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(no, updateProjectDto);
  }

  @Delete(':no')
  @ApiOperation({ summary: '프로젝트 삭제' })
  remove(@Param('no', ParseIntPipe) no: number) {
    return this.projectService.remove(no);
  }
}
