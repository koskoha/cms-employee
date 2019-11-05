/* eslint-disable no-console */
export default {
  Query: {
    messages: async (parent, args, { models }) => {
      const messages = await models.Message.findAll();
      return messages;
    },
    message: async (parent, { id }, { models }) => {
      try {
        return await models.Message.findByPk(id);
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      try {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      } catch (error) {
        console.log(error);
      }
    },
    deleteMessage: async (parent, { id }, { models }) => {
      try {
        return await models.Message.destroy({ where: { id } });
      } catch (error) {
        console.log(error);
      }
    },
  },
  Message: {
    user: async (message, args, { models }) => {
      try {
        return await models.User.findByPk(message.userId);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
