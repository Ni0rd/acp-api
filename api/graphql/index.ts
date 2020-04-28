import { IncomingMessage, IncomingHttpHeaders, ServerResponse } from 'http';
import { ApolloServer } from 'apollo-server-micro';
import microCors from 'micro-cors';
import Token from '../models/Token';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { Context } from './types';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing');
}
if (!process.env.WP_API_ENDPOINT) {
  throw new Error('WP_API_ENDPOINT missing');
}

function getTokenFromHeaders(headers: IncomingHttpHeaders): Token | null {
  const { authorization } = headers;
  if (!authorization) {
    return null;
  }
  // TODO: refactor in utils
  const tokenEncoded = authorization ? authorization.split(' ').pop() : null;
  if (!tokenEncoded) {
    return null;
  }
  return Token.getTokenFromEncoded(tokenEncoded);
}

function getContext(ctx: Context): Context {
  const token = getTokenFromHeaders(ctx.req.headers);
  ctx.userId = token?.payload.userId || null;
  return ctx;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: getContext,
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
