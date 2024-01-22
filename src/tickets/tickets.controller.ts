import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { TicketEntity } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/createTicket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/request';
import { TicketsEntity } from './entities/tickets.entity';

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
  @ApiCreatedResponse({ type: TicketsEntity })
  async findTickets(
    @Query() query: any,
    @Request() req: RequestWithUser
  ) {
    return this.ticketsService.findTickets(req.user.id, parseInt(query.page), parseInt(query.limit))
  }
}
