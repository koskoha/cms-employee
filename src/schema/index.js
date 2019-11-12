import { gql } from 'apollo-server-express';
import adminSchema from './admin';
import employeeSchema from './employee';
import jobSchema from './job';

const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;
export default [linkSchema, adminSchema, employeeSchema, jobSchema];
