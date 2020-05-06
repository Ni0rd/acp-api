import { DataSource, DataSourceConfig } from 'apollo-datasource';
import OdooXmlrpc from '../lib/odoo-xmlrpc';
import {
  OdooAddress,
  OdooEvent,
  OdooInvoice,
  OdooOrder,
  OdooUser,
} from '../@types/odoo';

export default class OdooDataSource<TContext> extends DataSource {
  public context!: TContext;

  public odoo!: OdooXmlrpc;

  constructor(odooConfig: OdooXmlrpc.Config) {
    super();
    this.odoo = new OdooXmlrpc(odooConfig);
  }

  initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
  }

  authenticate(
    credentials: OdooXmlrpc.UserCredentials
  ): Promise<number | null> {
    return this.odoo.authenticate(credentials);
  }

  // Addresses

  async getAddressesByIds(ids: number[]): Promise<OdooAddress[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'event.event',
      ids,
      fields: ['id', 'state', 'date_order', 'amount_total', 'invoice_ids'],
    }) as Promise<OdooAddress[]>;
  }

  async getAddressById(id: number): Promise<OdooAddress | null> {
    const [odooAddress] = await this.getAddressesByIds([id]);
    return odooAddress;
  }

  // Events

  async getEventsByIds(ids: number[]): Promise<OdooEvent[]> {
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
    return this.getEventsByIds(ids);
  }

  async getEventById(id: number): Promise<OdooEvent | null> {
    const [event] = await this.getEventsByIds([id]);
    return event;
  }

  // Invoices

  async getInvoicesByIds(ids: number[]): Promise<OdooInvoice[]> {
    return this.odoo.executeReadAsAdmin({
      model: 'account.move',
      ids,
      fields: ['id', 'invoice_payment_state', 'invoice_date', 'amount_total'],
    }) as Promise<OdooInvoice[]>;
  }

  // Orders

  async getOrdersByIds(ids: number[]): Promise<OdooOrder[]> {
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
    return this.getOrdersByIds(ids);
  }

  async getOrderById(id: number): Promise<OdooOrder | null> {
    const [order] = await this.getOrdersByIds([id]);
    return order;
  }

  getUserOrders(userId: number): Promise<OdooOrder[]> {
    const filters: OdooXmlrpc.Filters = [
      ['partner_id', '=', userId],
      ['state', '=', 'sale'],
    ];
    return this.getOrders(filters);
  }

  // Users

  async getUsersByIds(ids: number[]): Promise<OdooUser[]> {
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
    const [odooUser] = await this.getUsersByIds([userId]);
    return odooUser;
  }
}
