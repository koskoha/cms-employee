export const batchUsers = async (keys, models) => {
  const admins = await models.Admin.findAll({
    where: {
      id: keys,
    },
  });
  return keys.map(key => admins.find(admin => admin.id === key));
};
