import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class RegisterEntity {
    @PrimaryColumn()
    id!: string;
  
    @Column({ name: 'pw' })
    password!: string;
  
    @Column()
    name!: string;
  
    @Column({ nullable: true })
    mail!: string;
  
    @Column({ nullable: true })
    phone!: string;
  
    @Column({ nullable: true })
    team!: string;
  
    @Column({ nullable: true })
    image!: string;
  
    @Column({ nullable: true })
    grade!: string;
  
    @CreateDateColumn({ name: 'reg_date' })
    regDate!: Date;
  
    @UpdateDateColumn({ name: 'mod_date' })
    modDate!: Date;
}
