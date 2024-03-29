import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async login(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

        const isPassowrdValid = user.password === password;

        if (!isPassowrdValid) {
            throw new UnauthorizedException('Invalid password')
        }

        return {
            accessToken: this.jwtService.sign({ userId: user.id })
        }
    }
}
