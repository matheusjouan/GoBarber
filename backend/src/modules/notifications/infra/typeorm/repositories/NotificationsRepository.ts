import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationsDTO';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // Cria o repositório
    // Segundo parâmetro o nome da conexão, passando no ormconfig.json
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationsDTO): Promise<Notification> {
    const notifications = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notifications);

    return notifications;
  }
}

export default NotificationsRepository;
