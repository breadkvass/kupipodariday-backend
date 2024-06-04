import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async findAll(query?: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsRepository.find({
      ...query,
      relations: {
        owner: true,
        items: true,
      },
    });

    wishlists.forEach((wishlist) => {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
    });

    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist | undefined> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });

    return wishlist;
  }

  async remove(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
