import { gql } from 'apollo-server-micro';

export default gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    me: User!
  }

  type Query {
    me: User!
    activities: String!
    activity: String!
    plans: String!
    plan: String!
    committees: String!
    committee: String!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
  }
`;
