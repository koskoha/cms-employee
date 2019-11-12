import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    employees(cursor: String, limit: Int): EmployeeConnection!
    employee(id: ID!): Employee!
  }

  extend type Mutation {
    createEmployee(name: String!, position: EmployeePosition!, rate: Int!): Employee!
    deleteEmployee(id: ID!): Boolean!
    updateEmployee(id: ID!, text: String!): Boolean!
  }

  type EmployeeConnection {
    edges: [Employee!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Employee {
    id: ID!
    name: String!
    position: EmployeePosition!
    rate: Int!
    jobs: [Job!]
    admin: Admin!
    createdAt: Date!
  }

  enum EmployeePosition {
    DRIVER
    FOREMAN
    HELPER
  }

  extend type Subscription {
    employeeCreated: EmployeeCreated!
  }

  type EmployeeCreated {
    employee: Employee!
  }
`;
