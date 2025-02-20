import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectWithMembers } from './interfaces/project-with-members.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      // 1. 프로젝트 기본 정보 생성
      const projectData: Partial<Project> = {
        title: createProjectDto.title,
        detail: createProjectDto.detail,
        start_date: createProjectDto.start_date
          ? new Date(createProjectDto.start_date)
          : null,
        end_date: createProjectDto.end_date
          ? new Date(createProjectDto.end_date)
          : null,
      };

      const project = this.projectRepository.create(projectData);
      const savedProject = await this.projectRepository.save(project);

      // 3. 프로젝트 멤버 생성 및 연결
      const members = createProjectDto.members.map((member) =>
        this.projectMemberRepository.create({
          project: savedProject,
          user_id: member.user_id,
          role: member.role,
        }),
      );

      await this.projectMemberRepository.save(members);
      return savedProject;
    } catch (error) {
      console.error('프로젝트 생성 중 에러 발생:', error);
      throw error;
    }
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async findOne(no: number): Promise<ProjectWithMembers> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('members.user', 'user')
      .select([
        'project.no',
        'project.title',
        'project.detail',
        'project.start_date',
        'project.end_date',
        'project.reg_date',
        'project.mod_date',
        'members.role',
        'user.id',
        'user.name',
        'user.mail',
        'user.team',
        'user.grade',
      ])
      .where('project.no = :no', { no })
      .getOne();

    if (!project) {
      throw new NotFoundException(`Project #${no} not found`);
    }

    const response: ProjectWithMembers = {
      ...project,
      user_id: project.members?.[0]?.user?.id || null,
      role: project.members?.[0]?.role || null,
      members:
        project.members?.map((member) => ({
          user_id: member.user.id,
          name: member.user.name,
          mail: member.user.mail,
          team: member.user.team,
          grade: member.user.grade,
          role: member.role,
        })) || [],
    };

    return response;
  }

  async update(
    no: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectWithMembers> {
    const project = await this.findOne(no);
    const updatedProject = await this.projectRepository.save({
      ...project,
      ...updateProjectDto,
    });
    return this.findOne(no);
  }

  async remove(no: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { no } });
    if (!project) {
      throw new NotFoundException(`Project #${no} not found`);
    }
    await this.projectRepository.remove(project);
  }

  async findByUserId(userId: string): Promise<ProjectWithMembers[]> {
    try {
      console.log('=== Project 조회 시작 ===');
      console.log('Searching projects for userId:', userId);

      const projects = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'members')
        .leftJoinAndSelect('members.user', 'user')
        .where('members.user_id = :userId', { userId })
        .orderBy('project.reg_date', 'DESC')
        .getMany();

      const formattedProjects: ProjectWithMembers[] = projects.map(
        (project) => ({
          ...project,
          user_id: project.members?.[0]?.user?.id || null,
          role: project.members?.[0]?.role || null,
          members:
            project.members?.map((member) => ({
              user_id: member.user.id,
              name: member.user.name,
              mail: member.user.mail,
              team: member.user.team,
              grade: member.user.grade,
              role: member.role,
            })) || [],
        }),
      );

      console.log('Found projects count:', formattedProjects.length);
      return formattedProjects;
    } catch (error) {
      console.error('프로젝트 조회 중 에러 발생:', error);
      throw error;
    }
  }
}
