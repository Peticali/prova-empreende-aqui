import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: any): Promise<{
        id: number;
        email: string;
        password: string;
    }>;
    login(createUserDto: any): Promise<{
        access_token: string;
    }>;
}
