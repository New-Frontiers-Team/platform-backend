import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { TicketEntity } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/createTicket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/request';
import { TicketListEntity } from './entities/ticketList.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TicketEntity })
  async create(
    @Body() { title, description }: CreateTicketDto,
    @Request() req: RequestWithUser
  ) {
    return this.ticketsService.create(req.user.id, title, description)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TicketListEntity })
  async findTickets(
    @Query() query: any,
    @Request() req: RequestWithUser
  ) {
    return this.ticketsService.findTickets(req.user.id, req.user.role, parseInt(query.page), parseInt(query.limit))
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TicketEntity })
  async assumeTicket(
    @Param('id') id: string,
    @Request() req: RequestWithUser
  ) {
    return this.ticketsService.assumeTicket(id, req.user.id, req.user.role)
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TicketEntity })
  async closeTicket(
    @Param('id') id: string,
    @Request() req: RequestWithUser
  ) {
    return this.ticketsService.closeTicket(id, req.user.role)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TicketEntity })
  async deleteTicket(
    @Param('id') id: string,
    @Request() req: RequestWithUser
  ) {
    return this.ticketsService.deleteTicket(id, req.user.role)
  }
}
