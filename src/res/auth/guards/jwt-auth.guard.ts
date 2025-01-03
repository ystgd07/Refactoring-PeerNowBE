import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    console.log('JwtAuthGuard - Handling request:', {
      error: err,
      user: user,
      info: info
    });

    if (err || !user) {
      console.error('Authentication failed:', { err, info });
      throw new UnauthorizedException(
        info?.message || err?.message || '인증이 필요합니다.'
      );
    }

    return user;
  }
} 