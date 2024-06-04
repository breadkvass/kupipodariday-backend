import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(
    query?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[]> {
    return await this.usersRepository.find({ where: query });
  }

  async findOne(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    return await this.usersRepository.findOne({
      where: query,
      relations: ['wishes'],
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    await this.usersRepository.delete(id);
    return user;
  }
}
