import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user: { id: userId },
    });
    return await this.offersRepository.save(offer);
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
  }

  async findAll(
    query?: FindOptionsWhere<Offer> | FindOptionsWhere<Offer>[],
  ): Promise<Offer[]> {
    return await this.offersRepository.find({
      where: query,
      relations: ['user', 'item'],
    });
  }
  
  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    await this.offersRepository.update(id, updateOfferDto);
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
