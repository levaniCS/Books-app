import { Expose, Transform } from 'class-transformer';

export class BookDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  lastReadedPage: number;

  @Transform(({ obj }) => obj.author.id)
  @Expose()
  author: number;
}
