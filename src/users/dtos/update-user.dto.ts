import { IsEmail, IsString, IsOptional, Min } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  @Min(0)
  lastReadedPage: number;

  @IsString()
  @IsOptional()
  @Min(0)
  lastReadedBook: number;
}
