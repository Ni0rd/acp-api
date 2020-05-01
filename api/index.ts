import { IncomingMessage, ServerResponse } from 'http';
import { ApolloServer } from 'apollo-server-micro';
import microCors from 'micro-cors';
import typeDefs from './typeDefs';
import { resolvers } from './resolvers';
import { getDatasources } from './datasources';
import { getContext } from './context';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing');
}
if (!process.env.WP_API_ENDPOINT) {
  throw new Error('WP_API_ENDPOINT missing');
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: getContext,
  dataSources: getDatasources,
  introspection: process.env.NODE_ENV === 'development',
  playground: process.env.NODE_ENV === 'development',
});

// Apollo cannot handle OPTIONS requests, ignore them
// @see: https://github.com/apollographql/apollo-server/issues/2473
const corsHandler = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  apolloServer.createHandler()(req, res);
};

const handler = microCors()(corsHandler);

export default handler;
