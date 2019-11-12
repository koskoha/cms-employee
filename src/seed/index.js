import models from '../models';

export default async date => {
  await models.Admin.create(
    {
      username: 'kostya',
      email: 'kos.koha@gmail.com',
      password: '1234567',
      role: 'ADMIN',
      employees: [
        {
          name: 'boris',
          position: 'HELPER',
          rate: 16,
        },
      ],
      jobs: [
        {
          hours: 5,
        },
        {
          hours: 6,
        },
        {
          hours: 8,
        },
      ],
    },
    {
      include: [models.Employee, models.Job],
    }
  );
  await models.Admin.create(
    {
      username: 'igor',
      email: 'igor@gmail.com',
      password: '1234567',
      role: 'ADMIN',
      employees: [
        {
          name: 'tony',
          position: 'HELPER',
          rate: 16,
        },
        {
          name: 'adam',
          position: 'DRIVER',
          rate: 20,
        },
      ],
      jobs: [
        {
          hours: 6,
        },
        {
          hours: 10,
        },
        {
          hours: 11,
        },
      ],
    },
    {
      include: [models.Employee, models.Job],
    }
  );
};
