import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  password: string;

  role: Role;

  createdAt: Date;

  updatedAt: Date;
}