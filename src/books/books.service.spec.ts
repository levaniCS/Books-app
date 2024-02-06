import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Book } from './book.entity';
import { BookPage } from '../book-page/book-page.entity';
import { User } from '../users/user.entity';
import { BookPageService } from '../book-page/book-page.service';
import { UsersService } from '../users/users.service';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService, BookPageService, UsersService,
        { provide: getRepositoryToken(Book) , useValue: jest.fn() },
        { provide: getRepositoryToken(BookPage) , useValue: jest.fn() },
        { provide: getRepositoryToken(User) , useValue: jest.fn() }
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
