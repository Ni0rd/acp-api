import { gql } from 'apollo-server-micro';

export default gql`
  # Scalars

  scalar PositiveInt
  scalar PositiveFloat
  scalar DateTime
  scalar EmailAddress
  scalar PhoneNumber
  scalar HexColor
  scalar URL

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

  # Country State

  type CountryState {
    id: PositiveInt!
    name: String
    code: String
  }

  # Country

  type Country {
    id: PositiveInt!
    name: String
    code: String
  }

  # Address

  type Address {
    id: PositiveInt!
    name: String
    street: String
    street2: String
    city: String
    state: CountryState
    zipCode: String
    country: Country
  }

  # User

  type User {
    id: PositiveInt!
    firstname: String!
    lastname: String!
    email: EmailAddress!
    phone: PhoneNumber
    # subscription: Subscription
    addresses: [Address!]
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
    state: InvoiceState
    total: PositiveFloat
    date: DateTime
    # taxReceipt: String
  }

  # Orders

  type Order {
    id: PositiveInt!
    date: DateTime!
    total: PositiveFloat!
    invoices: [Invoice!]
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
  #   benefices: [PositiveInt]!
  #   prices: [PlanPrice]!
  #   options: [PlanOption]!
  #   file: URL!
  # }

  # Event types

  type EventType {
    id: PositiveInt!
    title: String!
  }

  # Events

  type Event {
    id: PositiveInt!
    planCategoriesIds: [PositiveInt!]!
    typeId: PositiveInt!
    dateBegin: DateTime!
    dateEnd: DateTime!
    title: String!
    image: URL
    description: String!
    address: Address
  }

  input EventsFiltersInput {
    eventTypes: [PositiveInt!]
  }

  type Query {
    # User
    me: User!
    myOrders: [Order]!
    myOrder(orderId: PositiveInt!): Order!
    # myEvents: [Event]!

    # # Plans
    # planCategories: [PlanCategory]!
    # plans(categoryId: PositiveInt!): [Plan]

    # Events
    eventTypes: [EventType!]!
    events(filters: EventsFiltersInput): [Event]!
    event(eventId: PositiveInt!): Event!
  }

  type Mutation {
    # Auth
    login(email: EmailAddress!, password: String!): LoginResult!
  }
`;
