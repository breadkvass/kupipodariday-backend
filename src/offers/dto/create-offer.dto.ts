import { IsNotEmpty, IsNumber, Min, IsBoolean, IsInt } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  @IsInt()
  itemId: number;
}
