import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICahceProvider';

import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  provider_id: string;
  date: Date;
  user_id: string;
}

// Diz que essa classe aceita injecção de dependência
@injectable()
class CreateAppointmentSerivce {
  // @inject => injeta a depedência com o nome dado, no arquivo container/index.ts
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    // Date.now(), pois estou mockando no teste
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You can`t create an appointment on a past date');
    }

    if (user_id === provider_id) {
      throw new AppError('You can`t create an appointment with yourserlf');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointment between 8am - 17pm');
    }

    const appointmentDateInSameDate = await this.appointmentsRepository.findByDate(
      {
        date: appointmentDate,
        provider_id,
      },
    );

    if (appointmentDateInSameDate) {
      throw new AppError('There is an anppointment in the same hour');
    }

    const appointment = await this.appointmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'as' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    // Invalidar o cache, pois houve mudança
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentSerivce;
