import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { Like } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

// TODO: добавить @UseGuards
  @Get('me')
  findUser(@Request() req) {
    return this.usersService.findOne({ id: req.user.userId });
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  // TODO: добавить @UseGuards
  @Patch('me')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  // TODO: добавить @UseGuards
  @Delete('me')
  remove(@Request() req) {
    return this.usersService.remove(req.user.userId);
  }

  @Post('find')
  async findUsers(@Body() findUsersDto: FindUsersDto) {
    const query = findUsersDto.query.trim();
    const users = await this.usersService.findAll([
      { username: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ]);

    if (users.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
    }
    
    return users;
  }
  
  // TODO: добавить @UseGuards
  @Get('me/wishes')
  async findUserWishes(@Request() req) {
    const user = await this.usersService.findOne({ id: req.user.userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes;
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
