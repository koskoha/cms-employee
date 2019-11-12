import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getAllJobs(cursor: String, limit: Int): [Job]!
    getJob(id: ID!): Job!
  }

  type Job {
    id: ID!
    hours: Int!
  }
`;
