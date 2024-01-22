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

  async findTickets(userId: number, page: number, limit: number) {
    try {
      const total = await this.prisma.ticket.count({
        where: {
          userId: userId
        }
      })

      const tickets = await this.prisma.ticket.findMany({
        where: {
          userId: userId
        },
        skip: (page - 1) * limit,
        take: limit
      })

      return ({ data: tickets, meta: { page: page, limit: limit, total: total } })
    } catch (error) {
      throw new BadRequestException('Someting bad happened.')
    }
  }
}
