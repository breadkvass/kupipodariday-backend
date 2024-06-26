import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.userId, createWishDto);
  }

  @Get('top')
  findTop() {
    return this.wishesService.findAll({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  @Get('last')
  findLast() {
    return this.wishesService.findAll({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);
    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    const wish = await this.wishesService.findOne(+id);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }

    if (wish.owner.id !== req.user.userId) {
      throw new ForbiddenException('У Вас нет доступа для редактирования этого желания');
    }

    return this.wishesService.update(+id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }

    if (wish.owner.id !== req.user.userId) {
      throw new ForbiddenException('У Вас нет доступа для удаления этого желания');
    }

    return this.wishesService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Request() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(+id);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }

    delete wish.id;
    const copiedWish = await this.wishesService.create(req.user.userId, {
      ...wish,
      copied: 0,
    });

    await this.wishesService.incrementCopied(+id);

    return copiedWish;
  }
}
