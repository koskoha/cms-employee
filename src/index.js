import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import DataLoader from 'dataloader';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import createUsersWithMessages from './seed';
import loaders from './loaders';

const app = express();
app.use(cors());

const getCurrentUser = async req => {
  const token = req.headers.authorization;
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message.replace('SequelizeValidationError: ', '').replace('Validation error: ', '');
    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          admin: new DataLoader(keys => loaders.admin.batchUsers(keys, models)),
        },
      };
    }
    if (req) {
      const currentUser = await getCurrentUser(req);
      return {
        models,
        currentUser,
        secret: process.env.SECRET,
        loaders: {
          admin: new DataLoader(keys => loaders.admin.batchUsers(keys, models)),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;

sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    createUsersWithMessages(new Date());
  }
  httpServer.listen({ port: process.env.PORT || 8000 }, () => {
    // eslint-disable-next-line no-console
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
