import { gql } from 'apollo-server-micro';

export default gql`
  # Scalars

  scalar PositiveInt
  scalar PositiveFloat
  scalar DateTime
  scalar EmailAddress
  scalar HexColor
  scalar URL

  # Common

  enum Lang {
    fr
    en
  }

  # type Coordinates {
  #   latitude: String!
  #   longitude: String!
  # }

  # type Location {
  #   coordinates: Coordinates!
  # }

  # Auth

  type LoginResult {
    token: String!
    me: User!
  }

  # # Subscription

  # enum SubscriptionStatus {
  #   ACTIVE
  #   INACTIVE
  # }

  # type Subscription {
  #   id: PositiveInt!
  #   plan: Plan!
  #   status: SubscriptionStatus!
  #   startDate: DateTime!
  #   endDate: DateTime!
  # }

  # User

  type User {
    id: PositiveInt!
    firstname: String!
    lastname: String!
    email: EmailAddress!
    # subscription: Subscription
  }

  # Invoices

  enum InvoiceState {
    WAITING_FOR_PAYMENT
    PROCESSING_PAYMENT
    PAID
    UNKNOWN
  }

  type Invoice {
    id: PositiveInt!
    state: InvoiceState!
    total: PositiveFloat!
    date: DateTime!
    # taxReceipt: String
  }

  # Orders

  type Order {
    id: PositiveInt!
    date: DateTime!
    total: PositiveFloat!
    invoices: [Invoice]!
  }

  # # Plan categories

  # enum PlanCategoryType {
  #   MEMBERSHIP
  #   COMMITTEE
  # }

  # type PlanCategoryBenefice {
  #   id: PositiveInt!
  #   title: String!
  # }

  # type PlanCategory {
  #   id: PositiveInt!
  #   title: String!
  #   description: String!
  #   type: PlanCategoryType!
  #   benefices: [PlanCategoryBenefice]!
  #   plans: [Plan]!
  # }

  # input PlanCategoriesFiltersInput {
  #   categoryType: PlanCategoryType
  # }

  # # Plans

  # type PlanPrice {
  #   id: PositiveInt!
  #   title: String!
  #   description: String!
  #   price: PositiveFloat!
  # }

  # type PlanOption {
  #   id: PositiveInt!
  #   title: String!
  #   description: String!
  #   price: PositiveFloat!
  # }

  # type Plan {
  #   id: PositiveInt!
  #   title: String!
  #   description: String!
  #   color: HexColor!
  #   benefices: [ID]!
  #   prices: [PlanPrice]!
  #   options: [PlanOption]!
  #   file: URL!
  # }

  # # Event types

  # type EventType {
  #   id: PositiveInt!
  #   title: String!
  # }

  # # Events

  # type Event {
  #   id: PositiveInt!
  #   categories: [PlanCategory]!
  #   date: DateTime!
  #   title: String!
  #   image: URL!
  #   type: EventType!
  #   description: String!
  #   location: Location!
  #   isFull: Boolean!
  #   isBooked: Boolean!
  # }

  # input EventsFiltersInput {
  #   eventTypes: [PositiveInt]
  # }

  type Query {
    # User
    me: User!
    myOrders(lang: Lang!): [Order]!
    # myEvents(lang: Lang!): [Event]!

    # # Plan categories
    # planCategories(
    #   lang: Lang!
    #   filters: PlanCategoriesFiltersInput
    # ): [PlanCategory]!
    # planCategory(lang: Lang!, categoryId: Int!): PlanCategory!

    # # Events
    # eventTypes(lang: Lang!): [EventType]!
    # events(lang: Lang!, filters: EventsFiltersInput): [Event]!
    # event(lang: Lang!): Event!
  }

  type Mutation {
    # Auth
    login(email: EmailAddress!, password: String!): LoginResult!
  }
`;
