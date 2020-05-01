import { AuthenticationError, ApolloError } from 'apollo-server-micro';
import {
  PositiveIntResolver,
  PositiveFloatResolver,
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
  HexColorCodeResolver,
} from 'graphql-scalars';
import { Resolvers, User, LoginResult, Order } from './@types/resolverTypes';
import { Context } from './@types/types';
import { login, signToken } from './utils/auth';

export const resolvers: Resolvers = {
  PositiveInt: PositiveIntResolver,
  PositiveFloat: PositiveFloatResolver,
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  HexColor: HexColorCodeResolver,
  URL: URLResolver,
  Query: {
    me: async (root, args, ctx: Context): Promise<User> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      const user = await ctx.dataSources.odooUser.getUserById(ctx.userId);
      if (!user) {
        throw new ApolloError(
          `The user with the id ${ctx.userId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return user;
    },
    myOrders: async (root, { lang }, ctx: Context): Promise<Order[]> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      return ctx.dataSources.odooOrder.getUserOrders(lang, ctx.userId);
    },
    // myEvents: (user, { lang }, ctx: Context) => {
    //   if (!ctx.userId) {
    //     throw new AuthenticationError('authentication required');
    //   }
    //   return ctx.dataSources.odooEvent.getUserEvents(lang, ctx.userId);
    // },
    // planCategories: (
    //   root,
    //   { lang, filters },
    //   ctx: Context
    // ): Promise<PlanCategory[]> => {
    //   return ctx.dataSources.odooPlanCategory.getPlanCategories(lang, filters);
    // },
    // planCategory: async (
    //   root,
    //   { lang, categoryId },
    //   ctx: Context
    // ): Promise<PlanCategory> => {
    //   const planCategory = await ctx.dataSources.odooPlanCategory.getPlanCategoryById(
    //     lang,
    //     categoryId
    //   );
    //   if (!planCategory) {
    //     throw new ApolloError(
    //       `The plan category with the id ${categoryId} does not exist.`,
    //       'NOT_FOUND'
    //     );
    //   }
    //   return planCategory;
    // },
    // eventTypes: (root, { lang }, ctx: Context): Promise<Array<EventType>> => {
    //   return ctx.dataSources.odooEventType.getEventTypes(lang);
    // },
    // events: async (
    //   root,
    //   { lang, filters },
    //   ctx: Context
    // ): Promise<Array<Event>> => {
    //   return ctx.dataSources.odooEvent.getEvents(lang, filters);
    // },
    // event: async (root, { lang, eventId }, ctx: Context): Promise<Event> => {
    //   const event = await ctx.dataSources.odooEvent.getEventById(lang, eventId);
    //   if (!event) {
    //     throw new ApolloError(
    //       `The event with the id ${eventId} does not exist.`,
    //       'NOT_FOUND'
    //     );
    //   }
    //   return event;
    // },
  },
  // Event: {
  //   isFull: (event, { filters }, ctx): Promise<boolean> => {
  //     if (!ctx.userId) {
  //       throw new AuthenticationError('authentication required');
  //     }
  //     return ctx.dataSources.odooEvent.getEventQuotaStatus(event.id, filters);
  //   },
  //   isBooked: (event, args, ctx: Context): Promise<boolean> => {
  //     if (!ctx.userId) {
  //       throw new AuthenticationError('authentication required');
  //     }
  //     return ctx.dataSources.odooBooking.getBooking({
  //       eventId: event.id,
  //       userId: ctx.userId,
  //     });
  //   },
  // },
  Mutation: {
    async login(
      root,
      args: { email: string; password: string },
      ctx: Context
    ): Promise<LoginResult> {
      const credentials = {
        username: args.email,
        password: args.password,
      };
      const user = await login(credentials, ctx.dataSources);
      if (!user) {
        throw new AuthenticationError('invalid credentials');
      }
      const tokenSigned = signToken(
        ctx.jwtConfig.secret,
        ctx.jwtConfig.durationDays,
        {
          userId: user.id,
        }
      );
      return {
        token: tokenSigned,
        me: user,
      };
    },
  },
};
