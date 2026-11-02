import {assertDatabaseConnection} from '../config/database.js';
import {env} from '../config/env.js';
import {sequelize} from '../models/index.js';

const force = process.argv.includes('--force');

async function migrate() {
  await assertDatabaseConnection();
  await sequelize.sync({force, alter: !force && env.isDev});
  console.log(
    force
      ? 'Database recreated (force sync).'
      : 'Database schema synchronized.',
  );
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
