import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'didtjdtn!2',
      database: 'prod',
      entities: [User, LoginEntity, TokenBlacklist],
      synchronize: true,
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

