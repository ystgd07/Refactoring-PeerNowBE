import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginRepository } from './login.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity } from './login.entity';
import { TokenBlacklistRepository } from './token.repository';
import { TokenBlacklist } from './token-blacklist.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([LoginEntity, TokenBlacklist]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('Login Module - JWT Secret:', secret ? 'exists' : 'missing');
        return {
          secret: secret,
          signOptions: { 
            expiresIn: '1h',
            algorithm: 'HS256'
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository, TokenBlacklistRepository],
  exports: [LoginService],
})
export class LoginModule {}