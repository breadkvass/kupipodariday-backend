import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  @Get(':username/wishes')
  async findOneByUsernameWishes(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes;
  }
}
