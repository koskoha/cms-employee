import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import { isAuthenticated, isMessageOwner } from './authorization';

import pubsub, { EVENTS } from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (_parent, { cursor, limit = 100 }, { models }) => {
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

        const messages = await models.Message.findAll({
          order: [['createdAt', 'DESC']],
          limit: limit + 1,
          ...cursorOptions,
        });

        const hasNextPage = messages.length > limit;
        const edges = hasNextPage ? messages.slice(0, -1) : messages;

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
        const message = await models.Message.create({
          text,
          userId: me.id,
        });

        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message },
        });
        return message;
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
    user: async (message, _args, { loaders }) => {
      try {
        return await loaders.user.load(message.userId);
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};
