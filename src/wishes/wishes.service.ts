import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Wish } from './wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: userId },
    });
    return await this.wishesRepository.save(wish);
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async findAll(query?: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.find({
      ...query,
      relations: ['owner'],
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishesRepository.update(id, updateWishDto);
    return await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async remove(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    await this.wishesRepository.delete(id);
    return wish;
  }
}
