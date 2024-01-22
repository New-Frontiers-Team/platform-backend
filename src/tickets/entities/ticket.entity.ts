import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '@prisma/client';

export class TicketEntity implements Ticket {
  constructor(partial: Partial<TicketEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  responsibleId: number | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}