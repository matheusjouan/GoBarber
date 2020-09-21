import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCahceProvider';

import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

// Categoriar o teste
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
  });
  it('should be able to create a new appointment', async () => {
    const user = await createUser.execute({
      name: 'Matheus',
      email: 'mjouan@hotmail.com',
      password: '111111',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same email', async () => {
    await createUser.execute({
      name: 'Matheus',
      email: 'mjouan@hotmail.com',
      password: '111111',
    });

    await expect(
      createUser.execute({
        name: 'Matheus',
        email: 'mjouan@hotmail.com',
        password: '111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
