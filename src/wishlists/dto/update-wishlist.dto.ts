import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  @MaxLength(250)
  name?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId?: number[];
}
