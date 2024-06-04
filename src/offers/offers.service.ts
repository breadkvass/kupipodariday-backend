import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Offer } from './offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async findAll(
    query?: FindOptionsWhere<Offer> | FindOptionsWhere<Offer>[],
  ): Promise<Offer[]> {
    return await this.offersRepository.find({
      where: query,
      relations: ['user', 'item'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
  }

  async remove(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
    await this.offersRepository.delete(id);
    return offer;
  }
}
