import { Module } from '@nestjs/common';
import { UserController } from './res/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterModule } from './res/register/register.module';
import { RegisterEntity } from './res/register/register.entity';
import { RegisterController } from './res/register/register.controller';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'didtjdtn!2',
    database: 'prod',
    entities: [RegisterEntity],
    synchronize: true,
  }), RegisterModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
