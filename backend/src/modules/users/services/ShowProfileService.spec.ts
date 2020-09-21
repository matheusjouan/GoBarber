import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

// Categoriar o teste
describe('ShowProfileUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jouan',
      email: 'mj@hotmail.com',
      password: '1111',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(user.name).toBe('Jouan');
    expect(user.email).toBe('mj@hotmail.com');
  });

  it('should be able to show profile', async () => {
    await expect(
      showProfile.execute({ user_id: 'no-wrong-user' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
