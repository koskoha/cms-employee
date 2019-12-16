import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin } from './authorization';
import job from '../schema/job';

const createToken = async (admin, secret, expiresIn) => {
  const { id, email, username, role } = admin;
  try {
    return await jwt.sign({ id, email, username, role }, secret, {
      expiresIn,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  Query: {
    admins: async (_parent, _args, { models }) => {
      const admins = await models.Admin.findAll();
      return admins;
    },
    admin: async (_parent, { id }, { models }) => {
      const admin = await models.Admin.findByPk(id);
      return admin;
    },
    currentUser: async (_parent, _args, { models, currentUser }) => {
      if (!currentUser) {
        console.log('NO USER');
        return null;
      }
      console.log('currentUser:', currentUser);
      const admin = await models.Admin.findByPk(currentUser.id);
      return admin;
    },
  },

  Mutation: {
    deleteAdmin: combineResolvers(isAdmin, async (_parent, { id }, { models }) => {
      try {
        return await models.Admin.destroy({
          where: { id },
        });
      } catch (error) {
        throw new Error(error);
      }
    }),
    signUp: async (_parent, { username, email, password, role }, { models, secret }) => {
      if (!role) {
        role = 'EMPLOYEE';
      }
      const admin = await models.Admin.create({
        username,
        email,
        password,
        role,
      });
      return { token: createToken(admin, secret, '30m') };
    },
    signIn: async (_parent, { login, password }, { models, secret }) => {
      const admin = await models.Admin.findByLogin(login);
      if (!admin) {
        throw new UserInputError('No admin found with this login credentials.');
      }
      const isValid = await admin.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      return { token: createToken(admin, secret, '30h') };
    },
  },

  Admin: {
    employees: async (admin, _args, { models }) => {
      const employees = await models.Employee.findAll({
        where: {
          adminId: admin.id,
        },
      });
      return employees;
    },
    jobs: async (admin, _args, { models }) => {
      const jobs = await models.Job.findAll({
        where: {
          adminId: admin.id,
        },
      });
      return jobs;
    },
  },
};
