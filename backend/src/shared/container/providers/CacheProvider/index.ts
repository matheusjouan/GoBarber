import { container } from 'tsyringe';

import ICacheProvider from './models/ICahceProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

// Listagem de todos os providers de Cache
const providers = {
  redis: RedisCacheProvider,
};

// Instancia o provider desejado
container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
