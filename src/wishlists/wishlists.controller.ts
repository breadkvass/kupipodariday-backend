import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(+id);

    if (!wishlist) {
      throw new NotFoundException('Список желаний не найден');
    }

    return wishlist;
  }
}
