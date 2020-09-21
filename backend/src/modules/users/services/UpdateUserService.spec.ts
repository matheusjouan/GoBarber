import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

import AppError from '@shared/errors/AppError';
import UpdateUserSerivce from './UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserService: UpdateUserSerivce;

// Categoriar o teste
describe('UpdtateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserService = new UpdateUserSerivce(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to upadate the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jouan',
      email: 'teste@teste.com',
      password: '111111',
    });

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      name: 'MJ',
      email: 'ax@ax.com',
    });

    expect(updatedUser.name).toBe('MJ');
    expect(updatedUser.email).toBe('ax@ax.com');
  });

  it('should not be able to change the email that already exists', async () => {
    await fakeUsersRepository.create({
      name: 'Jouan',
      email: 'teste@teste.com',
      password: '111111',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'wwwww@wwww.com',
      password: '111111',
    });

    await expect(
      updateUserService.execute({
        user_id: user.id,
        name: 'MJ',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to upadate the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jouan',
      email: 'teste@teste.com',
      password: '111',
    });

    const updatedUser = await updateUserService.execute({
      user_id: user.id,
      name: 'MJ',
      email: 'ax@ax.com',
      password: '222',
      oldPassword: '111',
    });

    expect(updatedUser.password).toBe('222');
  });

  it('should not be able to upadate without oldpassword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jouan',
      email: 'teste@teste.com',
      password: '111',
    });

    await expect(
      updateUserService.execute({
        user_id: user.id,
        name: 'MJ',
        email: 'ax@ax.com',
        password: '222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upadate with wrong oldpassword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jouan',
      email: 'teste@teste.com',
      password: '111',
    });

    await expect(
      updateUserService.execute({
        user_id: user.id,
        name: 'MJ',
        email: 'ax@ax.com',
        oldPassword: 'wrong-password',
        password: '222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update profile from non-existing user', async () => {
    await expect(
      updateUserService.execute({
        user_id: 'no-wrong-user',
        name: 'test',
        email: 'test@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
