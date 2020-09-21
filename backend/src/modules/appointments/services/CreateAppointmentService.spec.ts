import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCahceProvider';

import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

// Categoriar o teste
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // Reescrevendo a implementação dessa função
      return new Date(2020, 0, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 0, 10, 13),
      provider_id: '123123',
      user_id: 'user',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
    expect(appointment.user_id).toBe('user');
  });

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointment.execute({
      date: new Date(2222, 10, 15, 11),
      provider_id: '123123',
      user_id: 'user',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2222, 10, 15, 11),
        provider_id: '123123',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    /**
     * Simulação, qnd o método Date.now() for chamado eu quero retornar
     * um novo valor para ele (data no passado)
     */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // Reescrevendo a implementação dessa função
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 10, 11),
        provider_id: '123123',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // Reescrevendo a implementação dessa função
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 10, 13),
        provider_id: '111',
        user_id: '111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside the 8am-17pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // Reescrevendo a implementação dessa função
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 11, 7),
        provider_id: '111',
        user_id: '222',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 11, 18),
        provider_id: '111',
        user_id: '222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // Reescrevendo a implementação dessa função
      return new Date(2020, 0, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 0, 10, 13),
        provider_id: '111',
        user_id: '111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
