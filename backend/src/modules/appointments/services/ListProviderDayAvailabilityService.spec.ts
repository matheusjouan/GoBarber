import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

// Categoriar o teste
describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availabilty from provider', async () => {
    const user = await fakeUsersRepository.create({
      name: 'MJ',
      email: 'teste@teste.com',
      password: '111',
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 3, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: user.id,
      user_id: 'user',
      date: new Date(2020, 3, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 20, 11).getTime();
    });

    const availabilty = await listProviderDayAvailabilityService.execute({
      provider_id: user.id,
      year: 2020,
      month: 4,
      day: 20,
    });

    expect(availabilty).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
