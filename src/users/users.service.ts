import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.usersRepository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.email },
        ],
      })
    )
      throw new BadRequestException('Пользователь уже существует');
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findOne(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    return await this.usersRepository.findOne({
      where: query,
      relations: ['wishes'],
    });
  }

  async findAll(
    query?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[]> {
    return await this.usersRepository.find({ where: query });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (
      await this.usersRepository.findOne({
        where: [
          { email: updateUserDto.email },
          { username: updateUserDto.email },
        ],
      })
    )
      throw new BadRequestException('Пользователь уже существует');

    if (updateUserDto.password) {
      await this.usersRepository.update(id, {
        ...updateUserDto,
        password: await bcrypt.hash(updateUserDto.password, 10),
      });
    } else {
      await this.usersRepository.update(id, {
        ...updateUserDto,
      });
    }

    return await this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    await this.usersRepository.delete(id);
    return user;
  }
}
