import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  // Caso for utilizar outro driver, setar
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',

  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined,
    },
    // Disponível colocar outros tipos de provider
  },
} as ICacheConfig;
