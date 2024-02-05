import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth-guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { BookDto } from './dtos/book.dto';
import { BooksService } from './book.service';
import { GetBookPageQueryDto, GetBooksQueryDto } from './dtos/get-books-query.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  @UseGuards(AuthGuard)
  getBooks(@Query() query: GetBooksQueryDto) {
    return this.booksService.getAll(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(BookDto)
  createBook(@Body() body: CreateBookDto, @CurrentUser() user: User) {
    return this.booksService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateBook(@Param('id') id: string, @Body() body: UpdateBookDto, @CurrentUser() user: User) {
    return this.booksService.update(id, body, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getBookById(@Param('id') id: string, @Query() query: GetBookPageQueryDto, @CurrentUser() user: User) {
    return this.booksService.get(id, query, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteBook(@Param('id') id: string, @CurrentUser() user: User) {
    return this.booksService.delete(id, user);
  }
}
