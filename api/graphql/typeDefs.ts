import { gql } from 'apollo-server-micro';

export default gql`
  # Common
  enum Lang {
    fr
    en
  }

  type NotFoundError {
    message: String!
  }

  type Coordinates {
    latitude: String!
    longitude: String!
  }

  type Location {
    coordinates: Coordinates!
  }

  # Auth

  type AuthPayload {
    token: String!
    me: User!
  }

  # User

  enum OrderStatus {
    WAITING
    COMPLETE
  }

  type Order {
    id: ID!
    status: OrderStatus!
    date: String!
    total: Float!
    invoice: String
    taxReceipt: String
  }

  enum SubscriptionStatus {
    ACTIVE
    INACTIVE
  }

  type Subscription {
    id: ID!
    plan: Plan!
    status: SubscriptionStatus!
    startDate: String!
    endDate: String!
  }

  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    subscription: Subscription
    orders: [Order]!
    bookings: [Booking]!
  }

  # Plan categories

  enum PlanCategoryType {
    MEMBERSHIP
    COMMITTEE
  }

  type PlanCategoryBenefice {
    id: ID!
    title: String!
  }

  type PlanCategory {
    id: ID!
    title: String!
    description: String!
    type: PlanCategoryType!
    benefices: [PlanCategoryBenefice]!
    plans: [Plan]!
  }

  input PlanCategoriesFiltersInput {
    categoryType: PlanCategoryType
  }

  type PlanPrice {
    id: ID!
    title: String!
    description: String!
    price: Float!
  }

  type PlanOption {
    id: ID!
    title: String!
    description: String!
    price: Float!
  }

  type Plan {
    id: ID!
    title: String!
    description: String!
    color: String!
    benefices: [ID]!
    prices: [PlanPrice]!
    options: [PlanOption]!
    file: String!
  }

  # Events

  type EventType {
    id: ID!
    title: String!
  }

  type Event {
    id: ID!
    categories: [PlanCategory]!
    date: String!
    title: String!
    image: String!
    type: EventType!
    description: String!
    location: Location!
    isFull: Boolean!
    isBooked: Boolean!
  }

  input EventsFiltersInput {
    eventTypes: [ID]
  }

  # Booking

  type Booking {
    id: ID!
    event: Event!
  }

  type Query {
    # User
    me: User!

    # Plan categories
    planCategories(
      lang: Lang!
      filters: PlanCategoriesFiltersInput
    ): [PlanCategory]!
    planCategory(lang: Lang!, categoryId: ID!): PlanCategory!

    # Events
    eventTypes(lang: Lang!): [EventType]!
    events(lang: Lang!, filters: EventsFiltersInput): [Event]!
    event(lang: Lang!): Event!
  }

  type Mutation {
    # Auth
    login(email: String!, password: String!): AuthPayload
  }
`;
