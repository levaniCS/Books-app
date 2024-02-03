import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, { provide: getRepositoryToken(Book) , useValue: jest.fn() }],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
