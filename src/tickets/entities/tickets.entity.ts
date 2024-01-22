import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '@prisma/client';

type Pagination = {
  page: number,
  limit: number,
  total: number
}

export class TicketsEntity {
  constructor(partial: Partial<TicketsEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  data: Ticket[];

  @ApiProperty()
  meta: Pagination;
}