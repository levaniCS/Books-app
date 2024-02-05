import { Type } from 'class-transformer';
import { IsString, IsNumber, Min, IsOptional, IsObject, ValidateNested, IsNotEmptyObject } from 'class-validator';

export class UpdateBookPageDto {
  @IsNumber()
  pageId: number

  @IsString()
  newContent: string
}


export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsObject()
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => UpdateBookPageDto)
  bookPage: UpdateBookPageDto

  @IsString()
  @IsOptional()
  author: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  lastReadedPage: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  lastReadedBook: number;
}