import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description?: string;
}
