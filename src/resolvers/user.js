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
      const user = await models.User.findByPk(me.id);
      return user;
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
