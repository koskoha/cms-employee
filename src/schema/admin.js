import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    admins: [Admin!]
    admin(id: ID!): Admin
    me: Admin
  }
  extend type Mutation {
    signUp(username: String!, email: String!, password: String!, role: UserRole): Token!
    signIn(login: String!, password: String!): Token!
    deleteAdmin(id: ID!): Boolean!
  }
  type Token {
    token: String!
  }

  enum UserRole {
    ADMIN
    EMPLOYEE
  }

  type Admin {
    id: ID!
    username: String!
    email: String!
    employees: [Employee!]
    jobs: [Job!]
    role: UserRole
  }
`;
