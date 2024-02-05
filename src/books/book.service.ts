import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { Book } from './book.entity';
import { UpdateBookDto } from './dtos/update-book.dto';
import { GetBookPageQueryDto, GetBooksQueryDto } from './dtos/get-books-query.dto';
import { BookPageService } from 'src/book-page/book-page.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private repo: Repository<Book>,
    private bookPageService: BookPageService,
    private usersService: UsersService
  ) {}

  async getAll(getBooksDto: GetBooksQueryDto) {
    const { page } = getBooksDto;
    const TOTAL_NUMBER_EACH_PAGE = 2;
    return this.repo
      .createQueryBuilder()
      .skip((page - 1) * TOTAL_NUMBER_EACH_PAGE || 0)
      .take(page ? TOTAL_NUMBER_EACH_PAGE : 0)
      .getMany();
  }

  async create(bookDto: CreateBookDto, user: User) {
    const book = this.repo.create(bookDto);
    book.creator = user;
    const bookRecord = await this.repo.save(book);
    const content = await this.bookPageService.create(bookDto.content, bookRecord.id)
    return { ...bookRecord, content }
  }

  async update(id: string, bookDto: UpdateBookDto, user: User) {
    const book = await this.repo.findOne(id);
    if (!book) {
      throw new NotFoundException('book not found');
    }

    // Only user which created book or any admin role user can update book
    if (book.creator.id !== user.id && !user.admin) {
      throw new ForbiddenException('you do not have permission to update this book')
    }

    // Update book information
    await this.repo.update(id, { title: bookDto.title, author: bookDto.author });

    // Update book page if 'bookPage' exists payload
    const content = await this.bookPageService.update(id, bookDto.bookPage)
    return { ...book, content };
  }

  // http://localhost:3000/books/1?pageNumber=3
  async get(id: string, query: GetBookPageQueryDto, user: User) {

    if (id === 'recent') {
      const { lastReadedBook, lastReadedPage } = user

      if (!lastReadedBook) {
        throw new NotFoundException('you have not started reading any book')
      }
      const lastReadedBookPage = await this.get(String(lastReadedBook), { pageNumber: lastReadedPage }, user)
      return lastReadedBookPage
    }

    const book = await this.repo.findOne(id);
    if (!book) {
      throw new NotFoundException('book not found');
    }

    const content = await this.bookPageService.get(query)
    await this.usersService.update(user.id, { lastReadedBook: book.id, lastReadedPage: query.pageNumber || 1 })
    return { ...book, content };
  }

  async delete(id: string, user: User) {
    const book = await this.repo.findOne(id);

    if (!book) {
      throw new NotFoundException('book not found');
    }

    // Only user which created book or any admin role user can delete book
    if (book.creator.id !== user.id && !user.admin) {
      throw new ForbiddenException('you do not have permission to delete this book')
    }

    // Delete book record & all related pages info
    await this.repo.delete(id)
    await this.bookPageService.deleteByBook(+id)
    return true;
  }
}
