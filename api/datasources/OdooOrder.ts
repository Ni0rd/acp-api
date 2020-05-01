import OdooDataSource from './Odoo';
import { Order, InvoiceState, Invoice, Lang } from '../@types/resolverTypes';

function odooInvoiceStateReducer(state: Odoo.InvoiceState): InvoiceState {
  switch (state) {
    case 'not_paid':
      return InvoiceState.WAITING_FOR_PAYMENT;
    case 'in_payment':
      return InvoiceState.PROCESSING_PAYMENT;
    case 'paid':
      return InvoiceState.PAID;
    default:
      return InvoiceState.UNKNOWN;
  }
}

function odooInvoiceReducer(odooInvoice: Odoo.Invoice): Invoice {
  return {
    id: odooInvoice.id,
    state: odooInvoiceStateReducer(odooInvoice.invoice_payment_state),
    total: odooInvoice.amount_total,
    date: new Date(odooInvoice.invoice_date),
  };
}

function odooOrderReducer(
  odooInvoices: Odoo.Invoice[],
  odooOrder: Odoo.Order
): Order {
  return {
    id: odooOrder.id,
    date: new Date(odooOrder.date_order),
    total: odooOrder.amount_total,
    invoices: odooInvoices
      .filter((odooInvoice) => {
        return odooOrder.invoice_ids.includes(odooInvoice.id);
      })
      .map(odooInvoiceReducer),
  };
}

export default class OdoOrderDataSource<TContext> extends OdooDataSource<
  TContext
> {
  private async getOdooInvoicesByIds(
    lang: Lang,
    ids: number[]
  ): Promise<Odoo.Invoice[]> {
    return this.odoo.executeReadAsAdmin({
      model: 'account.move',
      ids,
      fields: ['id', 'invoice_payment_state', 'invoice_date', 'amount_total'],
    }) as Promise<Odoo.Invoice[]>;
  }

  private async getOdooOrdersIds(
    filters: OdooXmlrpc.Filters
  ): Promise<number[]> {
    return this.odoo.executeSearchAsAdmin({
      model: 'sale.order',
      filters,
    });
  }

  private async getOdooOrdersByIds(
    lang: Lang,
    ids: number[]
  ): Promise<Odoo.Order[]> {
    if (!ids.length) {
      return [];
    }
    return this.odoo.executeReadAsAdmin({
      model: 'sale.order',
      ids,
      fields: ['id', 'state', 'date_order', 'amount_total', 'invoice_ids'],
    }) as Promise<Odoo.Order[]>;
  }

  private async getOdooOrders(
    lang: Lang,
    filters: OdooXmlrpc.Filters
  ): Promise<Odoo.Order[]> {
    const ids = await this.getOdooOrdersIds(filters);
    return this.getOdooOrdersByIds(lang, ids);
  }

  async getOrders(lang: Lang, filters: OdooXmlrpc.Filters): Promise<Order[]> {
    const odooOrders = await this.getOdooOrders(lang, filters);
    const odooInvoiceIds = odooOrders.reduce((ids, odooOrder) => {
      ids.push(...odooOrder.invoice_ids);
      return ids;
    }, [] as number[]);
    const odooInvoices = await this.getOdooInvoicesByIds(lang, odooInvoiceIds);
    return odooOrders.map(odooOrderReducer.bind(null, odooInvoices));
  }

  getUserOrders(lang: Lang, userId: number): Promise<Order[]> {
    const filters: OdooXmlrpc.Filters = [
      ['partner_id', '=', userId],
      ['state', '=', 'sale'],
    ];
    return this.getOrders(lang, filters);
  }
}
