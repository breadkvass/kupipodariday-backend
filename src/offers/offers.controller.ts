import { Controller, Get, Param, NotFoundException, Post, Request, Body, BadRequestException, Delete, ForbiddenException } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService
  ) {}
  
// TODO: добавить @UseGuards
  @Post()
  async create(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }

    if (wish.owner.id === req.user.userId) {
      throw new BadRequestException('Вы не можете финансировать воё собственное желание');
    }

    if (Number(wish.raised) >= Number(wish.price)) {
      throw new BadRequestException('Желание уже полностью профинансировано');
    }

    const offer = await this.offersService.create(
      req.user.userId,
      createOfferDto,
    );

    wish.raised =
      (Number(wish.raised) * 100 + createOfferDto.amount * 100) / 100;
    await this.wishesService.update(wish.id, wish);

    return offer;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    return offer;
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

// TODO: добавить @UseGuards
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    if (offer.user.id !== req.user.userId) {
      throw new ForbiddenException('У Вас нет доступа для удаления этого предложения');
    }

    const wish = await this.wishesService.findOne(offer.item.id);
    wish.raised -= offer.amount;
    await this.wishesService.update(wish.id, wish);

    return this.offersService.remove(+id);
  }
}
