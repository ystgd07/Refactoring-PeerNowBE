import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectMember } from './project-member.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  no!: number;

  @Column({ nullable: true })
  title?: string;

  @Column('text', { nullable: true })
  detail?: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  start_date?: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  end_date?: Date | null;

  @CreateDateColumn({ name: 'reg_date' })
  reg_date!: Date;

  @UpdateDateColumn({ name: 'mod_date' })
  mod_date!: Date;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members!: ProjectMember[];
}
