import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterEntity } from './register.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(RegisterEntity)
        private registerRepository: Repository<RegisterEntity>,
    ) {}

    async postRegister(createUserDto: CreateUserDto) {
        // 기존 사용자 확인
        const existingUser = await this.registerRepository.findOne({
            where: { id: createUserDto.id }
        });

        if (existingUser) {
            throw new ConflictException('이미 존재하는 ID입니다.');
        }

        const register = this.registerRepository.create(createUserDto);
        return await this.registerRepository.save(register);
    }

    async getAllUsers() {
        return await this.registerRepository.find();
    }

    async getUser(id: string) {
        const user = await this.registerRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
