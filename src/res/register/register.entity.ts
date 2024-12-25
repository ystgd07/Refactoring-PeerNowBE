import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class RegisterEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    pw!: string;

    @Column()
    name!: string;
}
