import { IResolvers } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-micro';
import jsonwebtoken from 'jsonwebtoken';
import User from './models/User';
import UserProfile from './models/UserProfile';

export default {
  Query: {
    profile: async (root, args, ctx): Promise<UserProfile | null> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      const user = new User(ctx.userId);
      return user.getProfile();
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
      profile: UserProfile;
    }> {
      const user = await User.login({
        username: args.email,
        password: args.password,
      });
      if (!user) {
        throw new AuthenticationError('invalid credentials');
      }
      const profile = await user.getProfile();
      if (!profile) {
        throw new Error('profile not found');
      }
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
        profile,
      };
    },
  },
} as IResolvers;
