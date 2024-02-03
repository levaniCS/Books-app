import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // Create a fake copy of the users service

    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // If anyone asks for 'UsersService' give then 'fakeUsersService
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('test@test@com', 'somepass');

    expect(user.password).not.toEqual('somepass');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'somepass');
    try {
      await service.signup('test@test.com', 'somepass');
    } catch (err) {
      expect(err.response.statusCode).toEqual(400);
    }
  });

  it('throws an error if signin is called with an unused email', async () => {
    try {
      await service.signin('email@epam.com', 'passs');
    } catch (err) {
      expect(err.response.statusCode).toEqual(404);
    }
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('email@epam.com', 'somepass');
    try {
      await service.signin('email@epam.com', 'somepass2');
    } catch (err) {
      expect(err.response.statusCode).toEqual(400);
    }
  });

  it('returns a user if password is provided', async () => {
    await service.signup('test@test.com', 'mypassword');

    const user = await service.signin('test@test.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
