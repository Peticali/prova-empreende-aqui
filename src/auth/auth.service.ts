import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async register(user: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.usersService.createUser({ email: user.email, password: hashedPassword });
        return newUser;
    }

    async login(user: any) {
        const result = await this.validateUser(user.email, user.password);

        if (result === null) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        };
    }
}