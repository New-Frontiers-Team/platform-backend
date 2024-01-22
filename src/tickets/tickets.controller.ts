import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { TicketEntity } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/createTicket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/request';

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
}
