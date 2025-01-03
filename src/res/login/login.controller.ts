import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Headers } from '@nestjs/common';
@ApiTags('인증')
@Controller('api/user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    schema: {
      example: {
        user: {
          id: 'user123',
          name: '홍길동'
        },
        tokenInfo: {
          accessToken: 'eyJhbG...',
          refreshToken: 'eyJhbG...'
        }
      }
    }
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.loginService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.loginService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Req() req) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('토큰이 없습니다.');
      }
      
      return this.loginService.logout(req.user.sub, token);
    } catch (error) {
      throw new UnauthorizedException('로그아웃 처리 중 오류가 발생했습니다.');
    }
  }
}