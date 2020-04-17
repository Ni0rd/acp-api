import { IncomingMessage, ServerResponse } from 'http';
import { ApolloServer, gql } from 'apollo-server-micro';
import microCors from 'micro-cors';

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`;

const resolvers = {
  Query: {
    sayHello(): string {
      return 'hello world';
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

// Apollo cannot handle OPTIONS requests, ignore them
// @see: https://github.com/apollographql/apollo-server/issues/2473
const corsHandler = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  apolloServer.createHandler()(req, res);
};

export default microCors()(corsHandler);
