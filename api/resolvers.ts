import { IResolvers } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-micro';
import jsonwebtoken from 'jsonwebtoken';
import User from './models/User';

export default {
  Query: {
    me: async (root, args, ctx): Promise<User | null> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      const user = new User(ctx.userId);
      await user.fetchData();
      return user;
    },
    activities: (): string => 'Hello!',
    activity: (): string => 'Hello!',
    plans: (): string => 'Hello!',
    plan: (): string => 'Hello!',
    committees: (): string => 'Hello!',
    committee: (): string => 'Hello!',
  },
  Mutation: {
    async login(
      root,
      args: { email: string; password: string }
    ): Promise<{
      token: string;
      me: User;
    }> {
      const user = await User.login({
        username: args.email,
        password: args.password,
      });
      if (!user) {
        throw new AuthenticationError('invalid credentials');
      }
      await user.fetchData();
      const token = jsonwebtoken.sign(
        {
          userId: user.id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '365d',
        }
      );
      return {
        token,
        me: user,
      };
    },
  },
} as IResolvers;
