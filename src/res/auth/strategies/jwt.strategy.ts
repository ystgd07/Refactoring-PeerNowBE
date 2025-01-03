import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('JwtStrategy initialized with secret:', secret ? 'exists' : 'missing');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', payload);
    
    if (!payload || !payload.sub) {
      console.error('Invalid payload structure:', payload);
      throw new UnauthorizedException('Invalid token structure');
    }

    const user = { id: payload.sub, username: payload.username };
    console.log('JWT Strategy - Validated user:', user);
    
    return user;
  }
} 