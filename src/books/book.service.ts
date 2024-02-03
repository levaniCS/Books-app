import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { Book } from './book.entity';
import { UpdateBookDto } from './dtos/update-book.dto';
import { GetBooksQueryDto } from './dtos/get-books-query.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repo: Repository<Book>) {}

  async getAll(getBooksDto: GetBooksQueryDto) {
    const { page } = getBooksDto;
    const TOTAL_NUMBER_EACH_PAGE = 2;
    return this.repo
      .createQueryBuilder()
      .skip((page - 1) * TOTAL_NUMBER_EACH_PAGE || 0)
      .take(page ? TOTAL_NUMBER_EACH_PAGE : 0)
      .getMany();
  }

  create(bookDto: CreateBookDto, user: User) {
    const book = this.repo.create(bookDto);
    book.author = user;

    return this.repo.save(book);
  }

  async update(id: string, bookDto: UpdateBookDto, user: User) {
    const book = await this.repo.findOne(id);
    if (!book) {
      throw new NotFoundException('book not found');
    }

    // Only user which created book or any admin role user can update book
    if (book.author.id !== user.id && !user.admin) {
      throw new ForbiddenException('you do not have permission to update this book')
    }

    await this.repo.update(id, bookDto);
    return { ...book, ...bookDto };
  }

  async get(id: string) {
    const book = await this.repo.findOne(id);
    if (!book) {
      throw new NotFoundException('book not found');
    }

    return book;
  }

  async delete(id: string, user: User) {
    const book = await this.repo.findOne(id);

    if (!book) {
      throw new NotFoundException('book not found');
    }

    // Only user which created book or any admin role user can delete book
    if (book.author.id !== user.id && !user.admin) {
      throw new ForbiddenException('you do not have permission to delete this book')
    }

    return true;
  }
}
