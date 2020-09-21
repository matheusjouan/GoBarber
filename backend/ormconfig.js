module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTG_USERNAME,
    password: process.env.POSTG_PASSWORD,
    database: process.env.POSTG_DATABASE,
    entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations',
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    username: process.env.MONG_USERNAME,
    password: process.env.MONG_PASSWORD,
    database: process.env.MONG_DATABASE,
    useUnifiedTopology: true,
    entities: ['./src/modules/**/infra/typeorm/schemas/*.ts'],
  },
];
