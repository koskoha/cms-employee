import 'dotenv/config';
import Sequelize from 'sequelize';

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  const database = (process.env.TEST_DATABASE && process.env.TEST_DATABASE.trim()) || process.env.DATABASE;
  sequelize = new Sequelize(database, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: 'postgres',
    port: 5433,
  });
}
const models = {
  Admin: sequelize.import('./admin'),
  Employee: sequelize.import('./employee'),
  Job: sequelize.import('./job.js'),
};
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
export { sequelize };
export default models;
