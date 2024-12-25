import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
    getLogin() {
        return 'hello';
    }

}
