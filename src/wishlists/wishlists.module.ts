import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule, UsersModule],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
