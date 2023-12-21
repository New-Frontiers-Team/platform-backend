import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  password: string;
}