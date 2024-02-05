import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookPage } from './book-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookPage])],
})
export class BookPageModule {}
