import { Controller, Get } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Get('/login')
    getLogin() {
        return this.loginService.getLogin();
    }
}
