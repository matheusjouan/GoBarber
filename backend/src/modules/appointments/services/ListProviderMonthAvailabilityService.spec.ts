import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

// Categoriar o teste
describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availabilty from provider', async () => {
    const user = await fakeUsersRepository.create({
      name: 'MJ',
      email: 'teste@teste.com',
      password: '111',
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 20, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 6, 21, 8, 0, 0),
    });

    const availabilty = await listProviderMonthAvailabilityService.execute({
      provider_id: user.id,
      year: 2020,
      month: 7,
    });

    // Vai verifiar se é um array contendo a informação abaixo
    expect(availabilty).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
