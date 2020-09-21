import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICahceProvider';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    // Busca se possui informação de cache no Redis
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    // let users;

    if (!users) {
      users = await this.usersRepository.findAllProvider({
        expect_user_id: user_id,
      });

      /**
       * Após buscar as informações, salva no cache
       * Cache diferente para cada usuário da aplicação
       * ":" no redis significa subnivel
       */
      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      );
    }
    return users;
  }
}

export default ListProvidersService;
