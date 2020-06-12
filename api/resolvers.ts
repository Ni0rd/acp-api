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
  EventType,
  Country,
  CountryState,
} from './@types/resolverTypes';
import { Context } from './@types/types';
import { login, signToken } from './utils/auth';
import { odooUserReducer } from './reducers/odooUser';
import { odooOrderReducer, odooInvoiceReducer } from './reducers/odooOrder';
import { odooEventReducer } from './reducers/odooEvent';
import { odooAddressReducer } from './reducers/odooAddress';
import { odooEventTypeReducer } from './reducers/odooEventType';
import { odooCountryReducer } from './reducers/odooCountry';
import { odooCountryStateReducer } from './reducers/odooCountryState';

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
    myOrder: async (root, { orderId }, ctx: Context): Promise<Order> => {
      if (!ctx.odooUserId) {
        throw new AuthenticationError('authentication required');
      }
      const odooOrder = await ctx.dataSources.odoo.getUserOrder(
        ctx.odooUserId,
        orderId
      );
      if (!odooOrder) {
        throw new ApolloError(
          `The order with the id ${orderId} does not exist.`,
          'NOT_FOUND'
        );
      }
      return odooOrderReducer(odooOrder);
    },
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
    eventTypes: async (root, args, ctx: Context): Promise<Array<EventType>> => {
      const events = await ctx.dataSources.odoo.getEventTypes();
      return events.map(odooEventTypeReducer);
    },
  },
  User: {},
  Address: {
    state: async (
      { id }: Address,
      args,
      ctx: Context
    ): Promise<CountryState | null> => {
      // TODO: refactor this in getAddressCountryState
      const odooAddress = await ctx.dataSources.odoo.getAddressById(id);
      if (!(odooAddress && odooAddress.state_id)) {
        return null;
      }
      const odooState = await ctx.dataSources.odoo.getCountryStateById(
        odooAddress.state_id
      );
      if (!odooState) {
        return null;
      }
      return odooCountryStateReducer(odooState);
    },
    country: async (
      { id }: Address,
      args,
      ctx: Context
    ): Promise<Country | null> => {
      // TODO: refactor this in getAddressCountry
      const odooAddress = await ctx.dataSources.odoo.getAddressById(id);
      if (!(odooAddress && odooAddress.country_id)) {
        return null;
      }
      const odooCountry = await ctx.dataSources.odoo.getCountryById(
        odooAddress.country_id
      );
      if (!odooCountry) {
        return null;
      }
      return odooCountryReducer(odooCountry);
    },
  },
  Event: {
    address: async (
      { id }: Event,
      args,
      ctx: Context
    ): Promise<Address | null> => {
      const odooAddress = await ctx.dataSources.odoo.getEventAddress(id);
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
      const odooInvoices = await ctx.dataSources.odoo.getOrderInvoices(id);
      if (!odooInvoices) {
        return null;
      }
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
