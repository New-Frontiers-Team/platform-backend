import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/request';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiCreatedResponse({ type: UserEntity })
    async create(@Body() { username, email, password }: CreateUserDto) {
        return this.usersService.create(username, email, password)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: UserEntity })
    async findMe(@Request() req: RequestWithUser) {
        const user = await this.usersService.findOne(req.user.id)
        if (!user) {
            throw new NotFoundException('This user was not found.')
        }
        return new UserEntity(user)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: UserEntity })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOne(id)
        if (!user) {
            throw new NotFoundException('This user was not found.')
        }
        return new UserEntity(user)
    }
}
