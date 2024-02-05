import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './book.service';
import { BookPage } from 'src/book-page/book-page.entity';
import { BookPageService } from 'src/book-page/book-page.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookPage, User])],
  controllers: [BooksController],
  providers: [BooksService, BookPageService, UsersService],
})
export class BooksModule {}
