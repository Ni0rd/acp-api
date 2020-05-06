import { DataSource, DataSourceConfig } from 'apollo-datasource';
import DataLoader from 'dataloader';
import OdooXmlrpc from '../lib/odoo-xmlrpc';
import {
  OdooAddress,
  OdooEvent,
  OdooInvoice,
  OdooOrder,
  OdooUser,
  OdooEventType,
} from '../@types/odoo';

export default class OdooDataSource<TContext> extends DataSource {
  public context!: TContext;

  public odoo!: OdooXmlrpc;

  private loaders!: {
    orders: DataLoader<number, OdooOrder>;
    eventTypes: DataLoader<number, OdooEventType>;
    events: DataLoader<number, OdooEvent>;
    addresses: DataLoader<number, OdooAddress>;
    users: DataLoader<number, OdooUser>;
  };

  constructor(odooConfig: OdooXmlrpc.Config) {
    super();
    this.initOdoo(odooConfig);
    this.initLoaders();
  }

  initOdoo(odooConfig: OdooXmlrpc.Config): void {
    this.odoo = new OdooXmlrpc(odooConfig);
  }

  initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
  }

  initLoaders(): void {
    this.loaders = {
      orders: new DataLoader(async (keys) => {
        return this.getOrdersByIds([...keys]);
      }),
      eventTypes: new DataLoader(async (keys) => {
        return this.getEventTypesByIds([...keys]);
      }),
      events: new DataLoader(async (keys) => {
        return this.getEventsByIds([...keys]);
      }),
      addresses: new DataLoader(async (keys) => {
        return this.getAddressesByIds([...keys]);
      }),
      users: new DataLoader(async (keys) => {
        return this.getUsersByIds([...keys]);
      }),
    };
  }

  authenticate(
    credentials: OdooXmlrpc.UserCredentials
  ): Promise<number | null> {
    return this.odoo.authenticate(credentials);
  }

  // Addresses

  private async getAddressesByIds(ids: number[]): Promise<OdooAddress[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'event.event',
      ids,
      fields: ['id', 'state', 'date_order', 'amount_total', 'invoice_ids'],
    }) as Promise<OdooAddress[]>;
  }

  async getAddressById(addressId: number): Promise<OdooAddress | null> {
    return this.loaders.addresses.load(addressId);
  }

  // Event types

  private async getEventTypesByIds(ids: number[]): Promise<OdooEventType[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'event.type',
      ids,
      fields: ['id', 'name'],
    }) as Promise<OdooEventType[]>;
  }

  async getEventTypesIds(): Promise<number[]> {
    return this.odoo.executeSearchAsAdmin({
      model: 'event.type',
    });
  }

  async getEventTypes(): Promise<OdooEventType[]> {
    const ids = await this.getEventTypesIds();

    const eventTypes = await this.loaders.eventTypes.loadMany(ids);
    return eventTypes.filter(
      (eventType) => !(eventType instanceof Error)
    ) as OdooEventType[];
  }

  async getEventTypeById(eventTypeId: number): Promise<OdooEventType> {
    return this.loaders.eventTypes.load(eventTypeId);
  }

  // Events

  private async getEventsByIds(ids: number[]): Promise<OdooEvent[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'event.event',
      ids,
      fields: ['id', 'state', 'date_order', 'amount_total', 'invoice_ids'],
    }) as Promise<OdooEvent[]>;
  }

  async getEventsIds(filters: OdooXmlrpc.Filters): Promise<number[]> {
    return this.odoo.executeSearchAsAdmin({
      model: 'event.event',
      filters,
    });
  }

  async getEvents(filters?: {
    eventTypes?: number[] | null;
  }): Promise<OdooEvent[]> {
    const odooFilters: OdooXmlrpc.Filters = [];
    if (filters?.eventTypes) {
      odooFilters.push(['event_type_id', 'in', filters.eventTypes]);
    }
    const ids = await this.getEventsIds(odooFilters);

    const events = await this.loaders.events.loadMany(ids);
    return events.filter((event) => !(event instanceof Error)) as OdooEvent[];
  }

  async getEventById(eventId: number): Promise<OdooEvent | null> {
    return this.loaders.events.load(eventId);
  }

  // Invoices

  private async getInvoicesByIds(ids: number[]): Promise<OdooInvoice[]> {
    return this.odoo.executeReadAsAdmin({
      model: 'account.move',
      ids,
      fields: ['id', 'invoice_payment_state', 'invoice_date', 'amount_total'],
    }) as Promise<OdooInvoice[]>;
  }

  async getOrderInvoices(orderId: number): Promise<OdooInvoice[] | null> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      return null;
    }
    return this.getInvoicesByIds(order.invoice_ids);
  }

  // Orders

  private async getOrdersByIds(ids: number[]): Promise<OdooOrder[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'sale.order',
      ids,
      fields: ['id', 'state', 'date_order', 'amount_total', 'invoice_ids'],
    }) as Promise<OdooOrder[]>;
  }

  async getOrdersIds(filters: OdooXmlrpc.Filters): Promise<number[]> {
    return this.odoo.executeSearchAsAdmin({
      model: 'sale.order',
      filters,
    });
  }

  async getOrders(filters: OdooXmlrpc.Filters): Promise<OdooOrder[]> {
    const ids = await this.getOrdersIds(filters);
    const orders = await this.loaders.orders.loadMany(ids);
    return orders.filter((order) => !(order instanceof Error)) as OdooOrder[];
  }

  async getOrderById(orderId: number): Promise<OdooOrder | null> {
    return this.loaders.orders.load(orderId);
  }

  getUserOrders(userId: number): Promise<OdooOrder[]> {
    const filters: OdooXmlrpc.Filters = [
      ['partner_id', '=', userId],
      ['state', '=', 'sale'],
    ];
    return this.getOrders(filters);
  }

  // Users

  private async getUsersByIds(ids: number[]): Promise<OdooUser[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'res.users',
      ids,
      fields: ['id', 'name', 'email'],
    }) as Promise<OdooUser[]>;
  }

  async getUserIdByUsername(username: string): Promise<number> {
    const [userId] = await this.odoo.executeSearchAsAdmin({
      model: 'res.users',
      filters: [['email', '=', username]],
    });
    return userId;
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    await this.odoo.executeKwAsAdmin({
      model: 'res.users',
      method: 'write',
      data: [
        [userId],
        {
          password: newPassword,
        },
      ],
    });
  }

  async getUserById(userId: number): Promise<OdooUser | null> {
    return this.loaders.users.load(userId);
  }
}
