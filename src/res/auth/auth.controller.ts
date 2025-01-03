import { Controller, Get, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  // 토큰 검증 API
  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req) {
    console.log('Verify endpoint - Request headers:', req.headers);
    console.log('Verify endpoint - Authenticated user:', req.user);

    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      console.log('Token verification result:', decoded);

      return { 
        isValid: true,
        userId: req.user.id,
        decoded
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  // 현재 사용자 정보 조회 API
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    const user = await this.authService.findUserById(req.user.id);
    return { user };
  }
} 