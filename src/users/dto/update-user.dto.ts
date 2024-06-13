import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
