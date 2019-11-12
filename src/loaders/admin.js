export const batchUsers = async (keys, models) => {
  const admins = await models.Admin.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });
  return keys.map(key => admins.find(user => user.id === key));
};
