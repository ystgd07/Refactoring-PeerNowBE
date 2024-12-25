import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'test',
        description: 'The user ID'
    })
    @IsString()
    id!: string;

    @IsString()
    name!: string;

    @IsString()
    password!: string;
}
