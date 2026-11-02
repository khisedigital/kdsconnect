import {createApp} from './app.js';
import {env} from './config/env.js';
import {assertDatabaseConnection} from './config/database.js';
import {sequelize} from './models/index.js';
import {seedIfEmpty} from './db/seed.js';

async function bootstrap() {
  await assertDatabaseConnection();
  await sequelize.sync({alter: env.isDev});

  if (env.SEED_ON_BOOT || env.isDev) {
    await seedIfEmpty();
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(
      `KDS Connect API listening on http://localhost:${env.PORT}${env.API_PREFIX}`,
    );
  });
}

bootstrap().catch(err => {
  console.error('Failed to start API', err);
  process.exit(1);
});
