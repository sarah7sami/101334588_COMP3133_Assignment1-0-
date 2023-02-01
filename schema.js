const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
  }

  type Token {
    token: String!
    user: User!
  }

  type Employee {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    salary: Float
  }

  type Query {
    login(username: String!, password: String!): Token!
    allEmployees: [Employee]!
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(input: SignupInput!): Token!
    addEmployee(input: AddEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Employee!
  }
`;

module.exports = typeDefs;