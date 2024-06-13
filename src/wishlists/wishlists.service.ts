import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, In } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const owner = await this.usersService.findOne({ id: userId });
    const items = await this.wishesService.findAll({
      where: {
        id: In(createWishlistDto.itemsId)
      },
    });
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner,
      items,
    });
    
    return await this.wishlistsRepository.save(wishlist);
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

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    await this.wishlistsRepository.update(id, updateWishlistDto);
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
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
