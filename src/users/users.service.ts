import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(username: string, email: string, password: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: email } })

            if (user) {
                throw new ConflictException('Already existing account.')
            }

            await this.prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: await bcrypt.hash(password, 15)
                }
            })
            return null
        } catch (error) {
            if (error.status == 409) {
                throw new ConflictException('Already existing account.')
            }
            throw new BadRequestException('Something bad happened.')
        }
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
