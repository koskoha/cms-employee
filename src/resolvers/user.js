import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
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
    users: async (_parent, _args, { models }) => {
      const users = await models.User.findAll();
      return users;
    },
    user: async (_parent, { id }, { models }) => {
      const user = await models.User.findByPk(id);
      return user;
    },
    me: async (_parent, _args, { models, me }) => {
      if (!me) {
        return null;
      }
      const user = await models.User.findByPk(me.id);
      return user;
    },
  },

  Mutation: {
    deleteUser: combineResolvers(isAdmin, async (_parent, { id }, { models }) => {
      try {
        return await models.User.destroy({
          where: { id },
        });
      } catch (error) {
        throw new Error(error);
      }
    }),
    signUp: async (_parent, { username, email, password }, { models, secret }) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });
      return { token: createToken(user, secret, '30m') };
    },
    signIn: async (_parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);
      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      return { token: createToken(user, secret, '30m') };
    },
  },

  User: {
    messages: async (user, _args, { models }) => {
      const messages = await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
      return messages;
    },
  },
};
