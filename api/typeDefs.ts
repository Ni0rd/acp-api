import { gql } from 'apollo-server-micro';

export default gql`
  type Query {
    profile: User!
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

  type AuthPayload {
    token: String!
    profile: User!
  }

  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
  }
`;
