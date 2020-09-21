import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCahceProvider';

import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authUser: CreateSessionService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    authUser = new CreateSessionService(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to authenticate', async () => {
    await createUser.execute({
      name: 'Matheus',
      email: 'mjouan@hotmail.com',
      password: '111111',
    });

    const response = await authUser.execute({
      email: 'mjouan@hotmail.com',
      password: '111111',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authUser.execute({
        email: 'mjouan@hotmail.com',
        password: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Matheus',
      email: 'mjouan@hotmail.com',
      password: '111111',
    });

    await expect(
      authUser.execute({
        email: 'mjouan@hotmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
