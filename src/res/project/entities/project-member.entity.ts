import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../user/entities/user.entity';

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  user_id!: string;

  @ManyToOne(() => Project, (project) => project.members)
  @JoinColumn({ name: 'project_no' })
  project!: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  role!: string;

  @CreateDateColumn({ name: 'reg_date' })
  reg_date!: Date;
}
