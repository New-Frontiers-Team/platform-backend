import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { isAdmin } from 'src/helpers/authorization';
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

  async findTickets(userId: number, userRole: string, page: number, limit: number) {
    try {
      const total = await this.prisma.ticket.count({
        where: {
          userId: userId,
          deleted: null
        }
      })

      const tickets = await this.prisma.ticket.findMany({
        where: {
          ...(isAdmin(userRole) ? {} : { userId: userId }),
          deleted: null
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: true,
          responsible: true
        }
      })

      return ({ data: tickets, meta: { page: page, limit: limit, total: total } })
    } catch (error) {
      throw new BadRequestException('Someting bad happened.')
    }
  }

  async assumeTicket(ticketId: string, responsibleId: number, userRole: string) {
    if (!isAdmin(userRole)) throw new UnauthorizedException('You do not assume a ticket.')
    try {
      const ticket = await this.prisma.ticket.update({
        where: {
          id: ticketId
        },
        data: {
          responsibleId: responsibleId,
          status: "assumed"
        },
        include: {
          user: true,
          responsible: true
        }
      })

      return ticket
    } catch (error) {
      throw new BadRequestException('Somenting bad happened.')
    }
  }

  async closeTicket(ticketId: string, userRole: string) {
    if (!isAdmin(userRole)) throw new UnauthorizedException('You do not close a ticket.')
    try {
      const ticket = await this.prisma.ticket.update({
        where: {
          id: ticketId
        },
        data: {
          status: "closed"
        },
        include: {
          user: true,
          responsible: true
        }
      })

      return ticket
    } catch (error) {
      throw new BadRequestException('Somenting bad happened.')
    }
  }

  async deleteTicket(ticketId: string, userRole: string) {
    if (!isAdmin(userRole)) throw new UnauthorizedException('You can delete a ticket.')
    try {
      const ticket = await this.prisma.ticket.update({
        where: {
          id: ticketId
        },
        data: {
          deleted: new Date()
        },
        include: {
          user: true,
          responsible: true
        }
      })

      return ticket
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Somenting bad happened.')
    }
  }
}
