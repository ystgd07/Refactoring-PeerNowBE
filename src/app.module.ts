import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterModule } from './res/register/register.module';
import { LoginModule } from './res/login/login.module';
import { AuthModule } from './res/auth/auth.module';
import { User } from './res/user/entities/user.entity';
import { LoginEntity } from './res/login/login.entity';
import { TokenBlacklist } from './res/login/token-blacklist.entity';
import { UserModule } from './res/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = {
          type: 'mysql' as const,
          host: configService.get<string>('MYSQL_HOST') || 'localhost',
          port: parseInt(configService.get<string>('MYSQL_PORT') || '3306'),
          username: configService.get<string>('MYSQL_USERNAME') || 'root',
          password: configService.get<string>('MYSQL_PASSWORD') || '',
          database: configService.get<string>('MYSQL_DATABASE') || 'PEERNOW',
          entities: [User, LoginEntity, TokenBlacklist],
          synchronize: true,
        };
        
        console.log('Database Config:', {
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database
        });
        
        return config;
      },
      inject: [ConfigService],
    }),
    RegisterModule,
    LoginModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

