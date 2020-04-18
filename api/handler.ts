import { IncomingMessage, ServerResponse } from 'http';
import { ApolloServer } from 'apollo-server-micro';
import microCors from 'micro-cors';
import jsonwebtoken from 'jsonwebtoken';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing');
}
if (!process.env.WP_API_ENDPOINT) {
  throw new Error('WP_API_ENDPOINT missing');
}

interface Context {
  req: IncomingMessage;
  res: ServerResponse;
  userId: number | null;
}

interface TokenPayload {
  userId: number;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context(ctx: Context): Context {
    ctx.userId = null;

    const { authorization } = ctx.req.headers;
    const token = authorization ? authorization.split(' ').pop() : null;

    if (token) {
      try {
        const decoded: TokenPayload = jsonwebtoken.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any;
        ctx.userId = decoded.userId;
      } catch (err) {
        // Ignore errors
        console.log(err);
      }
    }

    return ctx;
  },
  introspection: true,
  playground: true,
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

export default microCors()(corsHandler);
