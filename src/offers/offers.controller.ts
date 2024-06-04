import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }
    return offer;
  }
}
