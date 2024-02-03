import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class GetBooksQueryDto {
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;
}
