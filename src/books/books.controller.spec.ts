import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksService } from './book.service';

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const fakeBookService = {
      getAll: () => Promise.resolve({}),
      create: () => Promise.resolve([{}]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService , useValue: fakeBookService }]
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
