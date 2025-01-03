import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginRepository } from './login.repository';
import { TokenBlacklistRepository } from './token.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistRepository: TokenBlacklistRepository,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { id, pw } = loginUserDto;
    
    // 디버깅을 위한 로그 추가
    console.log('Login attempt:', { id, pw });
    
    // 사용자 찾기
    const user = await this.loginRepository.findByUserId(id);
    console.log('Found user:', user);  // 사용자 조회 결과 확인

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(pw, user.password);
    console.log('Password validation:', { isPasswordValid });  // 비밀번호 검증 결과 확인

    if (!isPasswordValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 생성 시 로그 추가
    const payload = { sub: user.id, username: user.name };
    console.log('Creating JWT with payload:', payload);
    
    const accessToken = this.jwtService.sign(payload);
    console.log('Generated access token:', accessToken);
    
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      user: {
        id: user.id,
        name: user.name,
      },
      tokenInfo: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken);
      
      // 새로운 액세스 토큰 발급
      const newAccessToken = this.jwtService.sign({ 
        sub: payload.sub, 
        username: payload.username 
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    try {
        // 토큰 검증 및 만료 시간 추출
        const decoded = this.jwtService.verify(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000); // JWT exp는 초 단위
  
        // 블랙리스트에 토큰 추가
        await this.tokenBlacklistRepository.addToBlacklist(
          userId,
          refreshToken
        );
  
        return {
          success: true,
          message: '로그아웃이 성공적으로 완료되었습니다.'
        };
      } catch (error) {
        throw new UnauthorizedException('로그아웃 처리 중 오류가 발생했습니다.');
      }
  }

    // JWT 가드나 인터셉터에서 토큰 검증 시 사용
    async validateToken(token: string): Promise<boolean> {
        // 토큰이 블랙리스트에 있는지 확인
        const isBlacklisted = await this.tokenBlacklistRepository.isTokenBlacklisted(token);
        if (isBlacklisted) {
          return false;
        }
        return true;
      }
}