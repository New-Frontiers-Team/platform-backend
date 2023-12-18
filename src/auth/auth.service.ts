import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

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

    async register(username: string, email: string, password: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: email } })

            if (user) {
                throw new ConflictException('Already existing account.')
            } else {
                await this.prisma.user.create({
                    data: {
                        username: username,
                        email: email,
                        password: await bcrypt.hash(password, 15)
                    }
                })

                return null
            }
        } catch (error) {
            if (error.status == 409) {
                throw new ConflictException('Already existing account.')
            } else {
                throw new BadRequestException('Something bad happened.')
            }
        }
    }
}
