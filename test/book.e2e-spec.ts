import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateBookDto } from 'src/books/dtos/create-book.dto';
import { knownErrors } from './errors-list';

describe('Book API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  describe ('Create a new book API', () => {
    it('sign up as a new user and create book with provided data', async () => {
      const newUser = {
        email: 'test3@email.com',
        password: 'testpassword'
      }
      const newBook: CreateBookDto = {
        title: 'new book',
        content: 'content for book',
        lastReadedPage: 1
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook)
        .expect(201);

        expect(body.id).toBeDefined();
        expect(body.author).toEqual(userResponse.body.id);
    });

    it('throws an error unauthorized user tries to create a new book', async () => {
      const newBook: CreateBookDto = {
        title: 'new book',
        content: 'content for book',
        lastReadedPage: 1
      }

      const { body } = await request(app.getHttpServer())
        .post('/books')
        .send(newBook)
        .expect(403)
        expect(body.statusCode).toEqual(403);
        expect(body.error).toEqual(knownErrors.FORBIDDEN);
    });

    it('throws an error when user does not provide correct payload', async () => {
      const newUser = {
        email: 'test3@email.com',
        password: 'testpassword'
      }
      const newBook: Partial<CreateBookDto> = { content: 'content for book' }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook)
        .expect(400);

      expect(body.statusCode).toEqual(400);
      expect(body.error).toEqual(knownErrors.BAD_REQUEST);
    });
  })

  describe ('Get book by id API', () => {
    it('sign up as a new user, create a book and get it', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const newBook: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body: createBookBody } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook)
        .expect(201);

      const { body: getBookByIdBody } = await request(app.getHttpServer())
        .get(`/books/${createBookBody.id}`)
        .set('Cookie', cookie)
        .expect(200);

      expect(getBookByIdBody).toBeDefined();
      expect(getBookByIdBody.id).toEqual(createBookBody.id);
      expect(getBookByIdBody.title).toEqual(createBookBody.title);
    });

    it('throws 404 if book doesn not exist', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body: getBookByIdBody } = await request(app.getHttpServer())
        .get('/books/2313113')
        .set('Cookie', cookie)
        .expect(404);

      expect(getBookByIdBody).toBeDefined();
      expect(getBookByIdBody.statusCode).toEqual(404);
      expect(getBookByIdBody.error).toEqual(knownErrors.NOT_FOUND);
    });
  })

  describe ('Get books API', () => {
    it('Create books and get them', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);
      const cookie = userResponse.get('Set-Cookie');
      const newBook: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }
      const newBook2: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }

      const { body: createBookBody1 } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook)
        .expect(201);
      const { body: createBookBody2 } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook2)
        .expect(201);

      const { body: getBooksBody } = await request(app.getHttpServer())
        .get('/books')
        .set('Cookie', cookie)
        .expect(200);

      const [book1, book2] = getBooksBody

      expect(book1).toBeDefined();
      expect(book1.id).toEqual(createBookBody1.id);
      expect(book1.title).toEqual(createBookBody1.title);
      expect(book2).toBeDefined();
      expect(book2.id).toEqual(createBookBody2.id);
      expect(book2.title).toEqual(createBookBody2.title);
    });

    it('Create 5 books and get them with pagination ( page = 2 )', async () => {
      const TOTAL_NUMBER_EACH_PAGE = 2;
      const PAGE_NUMBER = 2
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);
      const cookie = userResponse.get('Set-Cookie');
      const books = []
      for(let i = 0; i < 5; i++) {
        books.push({
          title: `new book - ${i}`,
          content: `content for book - ${i}`,
        } as CreateBookDto)
      }

      const booksResponsePromises = books.map(async (bookContent) => {
        const { body: createBookBody } = await request(app.getHttpServer())
          .post('/books')
          .set('Cookie', cookie)
          .send(bookContent)
          .expect(201);
        return createBookBody
      })

      const bookResponseBodies = await Promise.all(booksResponsePromises)
      const { body: getBooksBody } = await request(app.getHttpServer())
        .get(`/books?page=${PAGE_NUMBER}`)
        .set('Cookie', cookie)
        .expect(200);

      expect(bookResponseBodies).toBeDefined();
      expect(bookResponseBodies.length).toEqual(5);
      expect(getBooksBody).toBeDefined();
      expect(getBooksBody.length).toEqual(TOTAL_NUMBER_EACH_PAGE);
    });

    it('throw error if page number is invalid integer or bellow 1', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);
      const cookie = userResponse.get('Set-Cookie');

      const { body: getBooksBody } = await request(app.getHttpServer())
        .get('/books?page=0')
        .set('Cookie', cookie)
        .expect(400);

        expect(getBooksBody.statusCode).toEqual(400);
        expect(getBooksBody.error).toEqual(knownErrors.BAD_REQUEST);
    });
  })

  describe ('Delete book API', () => {
    it('sign up as a new user, create a book and delete it', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const newBook: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body: createBookBody } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook)
        .expect(201);

      const response = await request(app.getHttpServer())
        .delete(`/books/${createBookBody.id}`)
        .set('Cookie', cookie)
        .expect(200);
      expect(response).toBeDefined();
      expect(!!response.text).toEqual(true);
    });

    it('throws 404 if book doesn not exist', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body: deleteBookBody } = await request(app.getHttpServer())
        .delete('/books/2313113')
        .set('Cookie', cookie)
        .expect(404);

      expect(deleteBookBody).toBeDefined();
      expect(deleteBookBody.statusCode).toEqual(404);
      expect(deleteBookBody.error).toEqual(knownErrors.NOT_FOUND);
    });

    it('throws forbidden if another user tries to delete book and user is not admin', async () => {
      const newUser1= {
        email: 'test1@email.com',
        password: 'testpassword'
      }
      const newUser2= {
        email: 'test2@email.com',
        password: 'testpassword'
      }
      const newBook: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }
      const user1Response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser1)
        .expect(201);
      const user2Response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser2)
        .expect(201);

      const cookieUser1 = user1Response.get('Set-Cookie');
      const cookieUser2 = user2Response.get('Set-Cookie');

      const { body: createBookBody } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookieUser1)
        .send(newBook)
        .expect(201);

      const { body: deleteBookBody } = await request(app.getHttpServer())
        .delete(`/books/${createBookBody.id}`)
        .set('Cookie', cookieUser2)
        .expect(403);

        expect(deleteBookBody.statusCode).toEqual(403);
        expect(deleteBookBody.error).toEqual(knownErrors.FORBIDDEN);
    });
  })

  describe ('Update book API', () => {
    it('sign up as a new user, create a book and update it', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const newBook: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }
      const updateBook: Partial<CreateBookDto> = {
        title: 'updated book data',
        lastReadedPage: 3
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body: createBookBody } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookie)
        .send(newBook)
        .expect(201);

      const { body: updateBookBody } = await request(app.getHttpServer())
        .patch(`/books/${createBookBody.id}`)
        .set('Cookie', cookie)
        .send(updateBook)
        .expect(200);

      // Get new book to verify
      const { body: getBookByIdBody } = await request(app.getHttpServer())
        .get(`/books/${updateBookBody.id}`)
        .set('Cookie', cookie)
        .expect(200);

      expect(updateBookBody).toBeDefined();
      expect(getBookByIdBody).toBeDefined();
      expect(getBookByIdBody.title).toEqual(updateBook.title);
      expect(getBookByIdBody.lastReadedPage).toEqual(updateBook.lastReadedPage);
    });

    it('throws 404 if book doesn not exist', async () => {
      const newUser = {
        email: 'test6@email.com',
        password: 'testpassword'
      }
      const updateBook: Partial<CreateBookDto> = {
        title: 'updated book data',
        lastReadedPage: 3
      }
      const userResponse = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      const cookie = userResponse.get('Set-Cookie');
      const { body: deleteBookBody } = await request(app.getHttpServer())
        .patch(`/books/22222`)
        .set('Cookie', cookie)
        .send(updateBook)
        .expect(404);

      expect(deleteBookBody).toBeDefined();
      expect(deleteBookBody.statusCode).toEqual(404);
      expect(deleteBookBody.error).toEqual(knownErrors.NOT_FOUND);
    });

    it('throws forbidden if another user tries to delete book and user is not admin', async () => {
      const newUser1= {
        email: 'test1@email.com',
        password: 'testpassword'
      }
      const newUser2= {
        email: 'test2@email.com',
        password: 'testpassword'
      }
      const newBook: CreateBookDto = {
        title: 'new book2',
        content: 'content for book',
        lastReadedPage: 1
      }
      const updateBook: Partial<CreateBookDto> = {
        title: 'updated book data',
        lastReadedPage: 3
      }
      const user1Response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser1)
        .expect(201);
      const user2Response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser2)
        .expect(201);

      const cookieUser1 = user1Response.get('Set-Cookie');
      const cookieUser2 = user2Response.get('Set-Cookie');

      const { body: createBookBody } = await request(app.getHttpServer())
        .post('/books')
        .set('Cookie', cookieUser1)
        .send(newBook)
        .expect(201);

      const { body: updateBookBody } = await request(app.getHttpServer())
        .patch(`/books/${createBookBody.id}`)
        .set('Cookie', cookieUser2)
        .send(updateBook)
        .expect(403);

        expect(updateBookBody.statusCode).toEqual(403);
        expect(updateBookBody.error).toEqual(knownErrors.FORBIDDEN);
    });
  })
});