import { ForbiddenError } from 'apollo-server';
import { skip, combineResolvers } from 'graphql-resolvers';

export const isAuthenticated = (_parent, _args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as Admin.');

export const isYourEmployee = async (_parent, { id }, { models, me }) => {
  const message = await models.Employee.findByPk(id, { raw: true });
  if (message.adminId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }
  return skip;
};

export const isAdmin = combineResolvers(isAuthenticated, (_parent, _args, { me: { role } }) =>
  role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
);
