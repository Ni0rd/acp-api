import { AuthenticationError, ApolloError } from 'apollo-server-micro';
import {
  PositiveIntResolver,
  PositiveFloatResolver,
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
  HexColorCodeResolver,
} from 'graphql-scalars';
import {
  Maybe,
  Resolvers,
  User,
  LoginResult,
  Order,
  Event,
  Address,
  Invoice,
} from './@types/resolverTypes';
import { Context } from './@types/types';
import { login, signToken } from './utils/auth';
import { odooUserReducer } from './reducers/odooUser';
import { odooOrderReducer, odooInvoiceReducer } from './reducers/odooOrder';
import { odooEventReducer } from './reducers/odooEvent';
import { odooAddressReducer } from './reducers/odooAddress';

export const resolvers: Resolvers = {
  PositiveInt: PositiveIntResolver,
  PositiveFloat: PositiveFloatResolver,
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  HexColor: HexColorCodeResolver,
  URL: URLResolver,
  Query: {
    me: async (root, args, ctx: Context): Promise<User> => {
      if (!ctx.odooUserId) {
        throw new AuthenticationError('authentication required');
      }
      const odooUser = await ctx.dataSources.odoo.getUserById(ctx.odooUserId);
      if (!odooUser) {
        throw new ApolloError(
          `The user with the id ${ctx.odooUserId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return odooUserReducer(odooUser);
    },
    myOrders: async (root, args, ctx: Context): Promise<Order[]> => {
      if (!ctx.odooUserId) {
        throw new AuthenticationError('authentication required');
      }
      const odooOrders = await ctx.dataSources.odoo.getUserOrders(
        ctx.odooUserId
      );
      return odooOrders.map(odooOrderReducer);
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
    events: async (root, { filters }, ctx: Context): Promise<Array<Event>> => {
      const events = await ctx.dataSources.odoo.getEvents(filters || undefined);
      return events.map(odooEventReducer);
    },
    event: async (root, { eventId }, ctx: Context): Promise<Event> => {
      const odooEvent = await ctx.dataSources.odoo.getEventById(eventId);
      if (!odooEvent) {
        throw new ApolloError(
          `The event with the id ${eventId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return odooEventReducer(odooEvent);
    },
  },
  Event: {
    address: async (
      { id }: Event,
      args,
      ctx: Context
    ): Promise<Address | null> => {
      const odooEvent = await ctx.dataSources.odoo.getEventById(id);
      if (!(odooEvent && odooEvent.address_id)) {
        return null;
      }
      const odooAddress = await ctx.dataSources.odoo.getAddressById(
        odooEvent.address_id
      );
      if (!odooAddress) {
        return null;
      }
      return odooAddressReducer(odooAddress);
    },
  },
  Order: {
    invoices: async (
      { id }: Order,
      args,
      ctx: Context
    ): Promise<Maybe<Invoice[]>> => {
      const odooOrder = await ctx.dataSources.odoo.getOrderById(id);
      if (!odooOrder) {
        return null;
      }
      const odooInvoices = await ctx.dataSources.odoo.getInvoicesByIds(
        odooOrder.invoice_ids
      );
      return odooInvoices.map(odooInvoiceReducer);
    },
  },
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
          odooUserId: user.id,
        }
      );
      return {
        token: tokenSigned,
        me: user,
      };
    },
  },
};
