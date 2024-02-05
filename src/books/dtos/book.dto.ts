import { Expose, Transform } from 'class-transformer';

export class BookDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  author: string;

  @Transform(({ obj }) => obj.creator.id)
  @Expose()
  creator: number;
}
