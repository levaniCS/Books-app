import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  lastReadedPage: number;
}
