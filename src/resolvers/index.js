import { GraphQLDateTime } from 'graphql-iso-date';

import adminResolvers from './admin';
import employeeResolvers from './employee';

const customScalarResolver = {
  Date: GraphQLDateTime,
};
export default [customScalarResolver, adminResolvers, employeeResolvers];
