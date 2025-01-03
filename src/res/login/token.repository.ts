import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenBlacklist } from './token-blacklist.entity';

@Injectable()
export class TokenBlacklistRepository {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly repository: Repository<TokenBlacklist>,
  ) {}

  async addToBlacklist(userId: string, token: string): Promise<void> {
    const blacklistedToken = this.repository.create({
      userId,
      token
    });
    await this.repository.save(blacklistedToken);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.repository.findOne({ where: { token } });
    return !!blacklistedToken;
  }
}