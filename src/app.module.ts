import { Module } from '@nestjs/common';
import { UserController } from './res/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterModule } from './res/register/register.module';
import { RegisterEntity } from './res/register/register.entity';
import { RegisterController } from './res/register/register.controller';
import { LoginModule } from './res/login/login.module';
import { LoginEntity } from './res/login/login.entity';
import { AuthModule } from './res/auth/auth.module';
import { User } from './res/user/entities/user.entity';
import { TokenBlacklist } from './res/login/token-blacklist.entity';
import { ConfigModule } from '@nestjs/config';

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
      entities: [RegisterEntity, LoginEntity, User, TokenBlacklist],
      synchronize: true,
    }), RegisterModule, LoginModule, AuthModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}

