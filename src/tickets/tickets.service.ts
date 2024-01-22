import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, title: string, description: string) {
    try {
      const ticket = await this.prisma.ticket.create({
        data: {
          userId: userId,
          title: title,
          messages: {
            create: {
              message: description,
              userId: userId
            }
          }
        }
      })

      return ticket
    } catch (error) {
      throw new BadRequestException('Someting bad happened.')
    }
  }
}
