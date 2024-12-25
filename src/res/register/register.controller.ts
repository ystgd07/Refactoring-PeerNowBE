import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post('/register')
    postRegister(@Body() createUserDto: CreateUserDto) {
        return this.registerService.postRegister(createUserDto);
    }

    @Get('/users')
    @ApiOperation({ summary: '모든 유저 조회' })
    @ApiResponse({ status: 200, description: '모든 유저 목록 반환' })
    async getAllUsers() {
        return this.registerService.getAllUsers();
    }

    @Get('/users/:id')
    @ApiOperation({ summary: '특정 유저 조회' })
    @ApiResponse({ status: 200, description: '특정 유저 정보 반환' })
    async getUser(@Param('id') id: string) {
        return this.registerService.getUser(id);
    }
}

