import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async postRegister(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { id: createUserDto.id }
        });

        if (existingUser) {
            throw new ConflictException('이미 존재하는 ID입니다.');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.pw, 10);

        const user = this.userRepository.create({
            id: createUserDto.id,
            password: hashedPassword,
            name: createUserDto.name
        });

        return await this.userRepository.save(user);
    }

    async getAllUsers() {
        return await this.userRepository.find();
    }

    async getUser(id: string) {
        return await this.userRepository.findOne({ where: { id } });
    }
}
