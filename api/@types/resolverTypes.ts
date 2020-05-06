import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  PositiveInt: number;
  EmailAddress: string;
  DateTime: Date;
  PositiveFloat: number;
  URL: string;
  HexColor: string;
};

export type Address = {
   __typename?: 'Address';
  name?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  street2?: Maybe<Scalars['String']>;
  town?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};



export type Event = {
   __typename?: 'Event';
  id: Scalars['PositiveInt'];
  planCategoriesIds: Array<Scalars['PositiveInt']>;
  typeId: Scalars['PositiveInt'];
  dateBegin: Scalars['DateTime'];
  dateEnd: Scalars['DateTime'];
  title: Scalars['String'];
  image?: Maybe<Scalars['URL']>;
  description: Scalars['String'];
  address?: Maybe<Address>;
};

export type EventsFiltersInput = {
  eventTypes?: Maybe<Array<Scalars['PositiveInt']>>;
};

export type EventType = {
   __typename?: 'EventType';
  id: Scalars['PositiveInt'];
  title: Scalars['String'];
};


export type Invoice = {
   __typename?: 'Invoice';
  id: Scalars['PositiveInt'];
  state?: Maybe<InvoiceState>;
  total?: Maybe<Scalars['PositiveFloat']>;
  date?: Maybe<Scalars['DateTime']>;
};

export enum InvoiceState {
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  PROCESSING_PAYMENT = 'PROCESSING_PAYMENT',
  PAID = 'PAID',
  UNKNOWN = 'UNKNOWN'
}

export type LoginResult = {
   __typename?: 'LoginResult';
  token: Scalars['String'];
  me: User;
};

export type Mutation = {
   __typename?: 'Mutation';
  login: LoginResult;
};


export type MutationLoginArgs = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
};

export type Order = {
   __typename?: 'Order';
  id: Scalars['PositiveInt'];
  date: Scalars['DateTime'];
  total: Scalars['PositiveFloat'];
  invoices?: Maybe<Array<Invoice>>;
};



export type Query = {
   __typename?: 'Query';
  me: User;
  myOrders: Array<Maybe<Order>>;
  eventTypes: Array<EventType>;
  events: Array<Maybe<Event>>;
  event: Event;
};


export type QueryEventsArgs = {
  filters?: Maybe<EventsFiltersInput>;
};


export type QueryEventArgs = {
  eventId: Scalars['PositiveInt'];
};


export type User = {
   __typename?: 'User';
  id: Scalars['PositiveInt'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['EmailAddress'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>,
  User: ResolverTypeWrapper<User>,
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>,
  Order: ResolverTypeWrapper<Order>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  PositiveFloat: ResolverTypeWrapper<Scalars['PositiveFloat']>,
  Invoice: ResolverTypeWrapper<Invoice>,
  InvoiceState: InvoiceState,
  EventType: ResolverTypeWrapper<EventType>,
  EventsFiltersInput: EventsFiltersInput,
  Event: ResolverTypeWrapper<Event>,
  URL: ResolverTypeWrapper<Scalars['URL']>,
  Address: ResolverTypeWrapper<Address>,
  Mutation: ResolverTypeWrapper<{}>,
  LoginResult: ResolverTypeWrapper<LoginResult>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  HexColor: ResolverTypeWrapper<Scalars['HexColor']>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  User: User,
  PositiveInt: Scalars['PositiveInt'],
  String: Scalars['String'],
  EmailAddress: Scalars['EmailAddress'],
  Order: Order,
  DateTime: Scalars['DateTime'],
  PositiveFloat: Scalars['PositiveFloat'],
  Invoice: Invoice,
  InvoiceState: InvoiceState,
  EventType: EventType,
  EventsFiltersInput: EventsFiltersInput,
  Event: Event,
  URL: Scalars['URL'],
  Address: Address,
  Mutation: {},
  LoginResult: LoginResult,
  Boolean: Scalars['Boolean'],
  HexColor: Scalars['HexColor'],
}>;

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  street2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  town?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  zipCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
}

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  planCategoriesIds?: Resolver<Array<ResolversTypes['PositiveInt']>, ParentType, ContextType>,
  typeId?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  dateBegin?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  dateEnd?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  image?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type EventTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventType'] = ResolversParentTypes['EventType']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface HexColorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColor'], any> {
  name: 'HexColor'
}

export type InvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  state?: Resolver<Maybe<ResolversTypes['InvoiceState']>, ParentType, ContextType>,
  total?: Resolver<Maybe<ResolversTypes['PositiveFloat']>, ParentType, ContextType>,
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<ResolversTypes['LoginResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>,
}>;

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  total?: Resolver<ResolversTypes['PositiveFloat'], ParentType, ContextType>,
  invoices?: Resolver<Maybe<Array<ResolversTypes['Invoice']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveFloat'], any> {
  name: 'PositiveFloat'
}

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  myOrders?: Resolver<Array<Maybe<ResolversTypes['Order']>>, ParentType, ContextType>,
  eventTypes?: Resolver<Array<ResolversTypes['EventType']>, ParentType, ContextType>,
  events?: Resolver<Array<Maybe<ResolversTypes['Event']>>, ParentType, ContextType, RequireFields<QueryEventsArgs, never>>,
  event?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryEventArgs, 'eventId'>>,
}>;

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL'
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Address?: AddressResolvers<ContextType>,
  DateTime?: GraphQLScalarType,
  EmailAddress?: GraphQLScalarType,
  Event?: EventResolvers<ContextType>,
  EventType?: EventTypeResolvers<ContextType>,
  HexColor?: GraphQLScalarType,
  Invoice?: InvoiceResolvers<ContextType>,
  LoginResult?: LoginResultResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Order?: OrderResolvers<ContextType>,
  PositiveFloat?: GraphQLScalarType,
  PositiveInt?: GraphQLScalarType,
  Query?: QueryResolvers<ContextType>,
  URL?: GraphQLScalarType,
  User?: UserResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
