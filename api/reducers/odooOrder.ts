import { OdooInvoiceState, OdooInvoice, OdooOrder } from '../@types/odoo';
import { InvoiceState, Invoice, Order } from '../@types/resolverTypes';

export function odooInvoiceStateReducer(state: OdooInvoiceState): InvoiceState {
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

export function odooInvoiceReducer(odooInvoice: OdooInvoice): Invoice {
  return {
    id: odooInvoice.id,
    state: odooInvoiceStateReducer(odooInvoice.invoice_payment_state),
    total: odooInvoice.amount_total,
    date: new Date(odooInvoice.invoice_date),
  };
}

export function odooOrderReducer(odooOrder: OdooOrder): Order {
  return {
    id: odooOrder.id,
    date: new Date(odooOrder.date_order),
    total: odooOrder.amount_total,
    invoices: odooOrder.invoice_ids.map((id) => ({ id })),
  };
}
