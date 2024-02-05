import { Book } from '../books/book.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  lastReadedPage: number;
  @Column({ nullable: true })
  lastReadedBook: number;

  @OneToMany(() => Book, (book: Book) => book.creator)
  books: Book[];

  @Column({ default: false })
  admin: boolean;

  // This hooks only runs when we save user instance into database
  // If we save user data as plain object this won't run hooks
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
