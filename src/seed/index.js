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
    },
    {
      include: [models.Employee],
    }
  );
  await models.Admin.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      employees: [],
    },
    {
      include: [models.Employee],
    }
  );
};
