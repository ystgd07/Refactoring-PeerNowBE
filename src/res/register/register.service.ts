import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterEntity } from './register.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

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

        // 비버깅을 위한 로그 추가
        console.log('Original password:', createUserDto.pw);
        const hashedPassword = await bcrypt.hash(createUserDto.pw, 10);
        console.log('Hashed password:', hashedPassword);

        // 해싱된 비밀번호로 사용자 생성
        const register = this.registerRepository.create({
            id: createUserDto.id,
            pw: hashedPassword,  // password 필드를 pw로 매핑
            name: createUserDto.name
        });

        // 저장 전 데이터 확인
        console.log('Saving user with data:', register);
        const savedUser = await this.registerRepository.save(register);
        console.log('Saved user:', savedUser);

        return savedUser;
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
