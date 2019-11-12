import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import { isAuthenticated, isYourEmployee } from './authorization';

import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    employees: async (_parent, { cursor, limit = 100 }, { models }) => {
      try {
        const cursorOptions = cursor
          ? {
              where: {
                createdAt: {
                  [Sequelize.Op.lt]: fromCursorHash(cursor),
                },
              },
            }
          : {};

        const employees = await models.Employee.findAll({
          order: [['createdAt', 'DESC']],
          limit: limit + 1,
          ...cursorOptions,
        });

        const hasNextPage = employees.length > limit;
        const edges = hasNextPage ? employees.slice(0, -1) : employees;

        return {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
          },
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    employee: async (_parent, { id }, { models }) => {
      try {
        return await models.Employee.findByPk(id);
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    createEmployee: combineResolvers(isAuthenticated, async (_parent, employeeInfo, { models, me }) => {
      try {
        const newEmployee = { ...employeeInfo, adminId: me.id };
        const employee = await models.Employee.create(newEmployee);

        pubsub.publish(EVENTS.EMPLOYEE.CREATED, {
          employeeCreated: { employee },
        });
        return employee;
      } catch (error) {
        throw new Error(error);
      }
    }),
    deleteEmployee: combineResolvers(isAuthenticated, isYourEmployee, async (_parent, { id }, { models }) => {
      try {
        return await models.Employee.destroy({ where: { id } });
      } catch (error) {
        throw new Error(error);
      }
    }),
  },

  Employee: {
    admin: async (employee, _args, { loaders }) => {
      try {
        return await loaders.admin.load(employee.adminId);
      } catch (error) {
        throw new Error(error);
      }
    },
    jobs: async (_employee, _args, { models }) => {
      const jobs = await models.Job.findAll({
        include: [
          {
            model: models.Employee,
            as: 'employees',
            required: false,
            attributes: ['id', 'name'],
          },
        ],
      });
      return jobs;
    },
  },

  Subscription: {
    employeeCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.EMPLOYEE.CREATED),
    },
  },
};
