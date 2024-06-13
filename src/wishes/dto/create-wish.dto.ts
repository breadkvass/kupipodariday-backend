import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @IsOptional()
  @IsNumber()
  copied?: number;
}
