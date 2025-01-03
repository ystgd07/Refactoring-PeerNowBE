import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LoginEntity } from './login.entity'; // User 엔티티 경로에 맞게 수정 필요
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoginRepository {
  constructor(
    @InjectRepository(LoginEntity)
    private readonly repository: Repository<LoginEntity>,
  ) {}

  async findByUserId(id: string): Promise<LoginEntity | null> {
    // 디버깅을 위한 로그 추가
    console.log('Finding user with id:', id);
    
    const user = await this.repository.findOne({ 
      where: { id } 
    });
    
    console.log('Database query result:', user);
    return user;
  }
}