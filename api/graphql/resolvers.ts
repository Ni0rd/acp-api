import { IResolvers } from 'graphql-tools';
import { AuthenticationError, ApolloError } from 'apollo-server-micro';
import User from '../models/User';
import Order from '../models/Order';
import PlanCategory from '../models/PlanCategory';
import Event from '../models/Event';
import EventType from '../models/EventType';
import Token from '../models/Token';

export default {
  Query: {
    me: async (root, args, ctx): Promise<User> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      const user = await User.getOne(ctx.userId);
      if (!user) {
        throw new ApolloError(
          `The user with the id ${ctx.userId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return user;
    },
    planCategories: (root, { lang, filters }): Promise<Array<PlanCategory>> => {
      return PlanCategory.getAll(lang, filters);
    },
    planCategory: async (root, { lang, categoryId }): Promise<PlanCategory> => {
      const planCategory = await PlanCategory.getOne(lang, categoryId);
      if (!planCategory) {
        throw new ApolloError(
          `The plan category with the id ${categoryId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return planCategory;
    },
    eventTypes: (root, { lang }): Promise<Array<EventType>> => {
      return EventType.getAll(lang);
    },
    events: async (root, { lang, filters }): Promise<Array<Event>> => {
      return Event.getAll(lang, filters);
    },
    event: async (root, { lang, eventId }): Promise<Event> => {
      const event = await Event.getOne(lang, eventId);
      if (!event) {
        throw new ApolloError(
          `The event with the id ${eventId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return event;
    },
  },
  User: {
    orders: (user): Promise<Array<Order>> => {
      return user.getOrders();
    },
    bookings: (user): Promise<Array<Order>> => {
      return user.getBookings();
    },
  },
  Event: {
    isFull: (event, args, ctx): Promise<boolean> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      return event.isFull();
    },
    isBooked: (event, args, ctx): Promise<boolean> => {
      if (!ctx.userId) {
        throw new AuthenticationError('authentication required');
      }
      return event.isBooked(ctx.userId);
    },
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
      const token = new Token({
        userId: user.id,
      });
      return {
        token: token.getSigned(),
        me: user,
      };
    },
  },
} as IResolvers;
