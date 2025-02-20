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
import { ProjectModule } from './res/project/project.module';
import { Project } from './res/project/entities/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('MYSQL_HOST'),
        port: parseInt(configService.get<string>('MYSQL_PORT') || '3306'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    RegisterModule,
    LoginModule,
    AuthModule,
    UserModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

