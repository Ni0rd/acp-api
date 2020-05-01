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
  PositiveFloat: number;
  DateTime: Date;
  EmailAddress: string;
  HexColor: string;
  URL: string;
};







export enum Lang {
  FR = 'fr',
  EN = 'en'
}

export type LoginResult = {
   __typename?: 'LoginResult';
  token: Scalars['String'];
  me: User;
};

export type User = {
   __typename?: 'User';
  id: Scalars['PositiveInt'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['EmailAddress'];
};

export enum InvoiceState {
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  PROCESSING_PAYMENT = 'PROCESSING_PAYMENT',
  PAID = 'PAID',
  UNKNOWN = 'UNKNOWN'
}

export type Invoice = {
   __typename?: 'Invoice';
  id: Scalars['PositiveInt'];
  state: InvoiceState;
  total: Scalars['PositiveFloat'];
  date: Scalars['DateTime'];
};

export type Order = {
   __typename?: 'Order';
  id: Scalars['PositiveInt'];
  date: Scalars['DateTime'];
  total: Scalars['PositiveFloat'];
  invoices: Array<Maybe<Invoice>>;
};

export type Query = {
   __typename?: 'Query';
  me: User;
  myOrders: Array<Maybe<Order>>;
};


export type QueryMyOrdersArgs = {
  lang: Lang;
};

export type Mutation = {
   __typename?: 'Mutation';
  login: LoginResult;
};


export type MutationLoginArgs = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
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
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>,
  PositiveFloat: ResolverTypeWrapper<Scalars['PositiveFloat']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>,
  HexColor: ResolverTypeWrapper<Scalars['HexColor']>,
  URL: ResolverTypeWrapper<Scalars['URL']>,
  Lang: Lang,
  LoginResult: ResolverTypeWrapper<LoginResult>,
  User: ResolverTypeWrapper<User>,
  InvoiceState: InvoiceState,
  Invoice: ResolverTypeWrapper<Invoice>,
  Order: ResolverTypeWrapper<Order>,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  PositiveInt: Scalars['PositiveInt'],
  PositiveFloat: Scalars['PositiveFloat'],
  DateTime: Scalars['DateTime'],
  EmailAddress: Scalars['EmailAddress'],
  HexColor: Scalars['HexColor'],
  URL: Scalars['URL'],
  Lang: Lang,
  LoginResult: LoginResult,
  User: User,
  InvoiceState: InvoiceState,
  Invoice: Invoice,
  Order: Order,
  Query: {},
  Mutation: {},
}>;

export interface PositiveIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export interface PositiveFloatScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PositiveFloat'], any> {
  name: 'PositiveFloat'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
}

export interface HexColorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColor'], any> {
  name: 'HexColor'
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL'
}

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type InvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  state?: Resolver<ResolversTypes['InvoiceState'], ParentType, ContextType>,
  total?: Resolver<ResolversTypes['PositiveFloat'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  id?: Resolver<ResolversTypes['PositiveInt'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  total?: Resolver<ResolversTypes['PositiveFloat'], ParentType, ContextType>,
  invoices?: Resolver<Array<Maybe<ResolversTypes['Invoice']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  myOrders?: Resolver<Array<Maybe<ResolversTypes['Order']>>, ParentType, ContextType, RequireFields<QueryMyOrdersArgs, 'lang'>>,
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<ResolversTypes['LoginResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  PositiveInt?: GraphQLScalarType,
  PositiveFloat?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  EmailAddress?: GraphQLScalarType,
  HexColor?: GraphQLScalarType,
  URL?: GraphQLScalarType,
  LoginResult?: LoginResultResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
  Invoice?: InvoiceResolvers<ContextType>,
  Order?: OrderResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
