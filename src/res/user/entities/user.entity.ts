import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'pw' })
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  email!: string;

  @CreateDateColumn()
  created_at!: Date;
} 