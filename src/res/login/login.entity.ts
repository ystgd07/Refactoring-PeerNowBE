import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class LoginEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ name: 'pw' })
    password!: string;

    @Column()
    name!: string;
}
