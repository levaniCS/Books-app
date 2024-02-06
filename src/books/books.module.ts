import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './book.service';
import { BookPage } from '../book-page/book-page.entity';
import { BookPageService } from '../book-page/book-page.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookPage, User])],
  controllers: [BooksController],
  providers: [BooksService, BookPageService, UsersService],
})
export class BooksModule {}
