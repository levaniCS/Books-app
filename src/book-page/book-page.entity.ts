import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BookPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  pageNumber: number;

  @Column()
  bookId: number
}
