import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetBookPageQueryDto } from '../books/dtos/get-books-query.dto';
import { BookPage } from '../book-page/book-page.entity';
import { UpdateBookPageDto } from '../books/dtos/update-book.dto';

@Injectable()
export class BookPageService {
  constructor(@InjectRepository(BookPage) private repo: Repository<BookPage>) {}

  async create(content: string, bookId: number) {
    // For testing create pages including 2 charactters each page
    const contentChunksSeparatedEachPage = content.match(/.{1,2}/g);
    const contentPromises = contentChunksSeparatedEachPage.map(async (item, i) => await this.repo.insert({ content: item, pageNumber: i + 1, bookId }))

    await Promise.all(contentPromises)
    const allPagesContent =  await this.repo.find({ bookId })
    return allPagesContent
  }

  async update(id: string, bookPage: UpdateBookPageDto) {
    if (!bookPage) return

    const { newContent, pageId } = bookPage;
    await this.repo.update(pageId, { content: newContent })
    const allPagesContent = await this.repo.find({ bookId: +id })
    return allPagesContent;
  }

  // GET http://localhost:3000/books/1?pageNumber=3
  async get(query: GetBookPageQueryDto) {
    const content = await this.repo.find({ pageNumber: query.pageNumber || 1 })
    return content[0]
  }

  async deleteByBook(bookId: number) {
    await this.repo.delete({ bookId })
    return true
  }
}
