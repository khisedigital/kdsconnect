import {Sequelize} from 'sequelize';

import {env} from './env.js';

export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: env.DB_LOGGING ? console.log : false,
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30_000,
      idle: 10_000,
    },
  },
);

export async function assertDatabaseConnection() {
  await sequelize.authenticate();
}
