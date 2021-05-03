import { Sequelize } from 'sequelize';

export const dbUtils = {
  now: Sequelize.fn('NOW')
};

export const db = new Sequelize({
  host: 'localhost',
  database: 'eliferd_log_api',
  dialect: 'postgres',
  username: 'elogapi',
  port: 5432,
  password: process.env.ELOGAPI_PWD || '0000'
});
