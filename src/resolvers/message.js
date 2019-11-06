import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    messages: async (_parent, _args, { models }) => {
      const messages = await models.Message.findAll();
      return messages;
    },
    message: async (_parent, { id }, { models }) => {
      try {
        return await models.Message.findByPk(id);
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createMessage: combineResolvers(isAuthenticated, async (_parent, { text }, { models, me }) => {
      try {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      } catch (error) {
        throw new Error(error);
      }
    }),
    deleteMessage: combineResolvers(isAuthenticated, isMessageOwner, async (_parent, { id }, { models }) => {
      try {
        return await models.Message.destroy({ where: { id } });
      } catch (error) {
        throw new Error(error);
      }
    }),
  },
  Message: {
    user: async (message, _args, { models }) => {
      try {
        return await models.User.findByPk(message.userId);
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
