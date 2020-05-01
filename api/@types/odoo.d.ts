declare namespace Odoo {
  export type User = {
    id: number;
    email: string;
    name: string;
  };

  export type InvoiceState = 'not_paid' | 'in_payment' | 'paid';

  export type Invoice = {
    id: number;
    invoice_payment_state: InvoiceState;
    invoice_date: string;
    amount_total: number;
  };

  type OrderInvoiceStatus = 'upselling' | 'invoiced' | 'to invoice' | 'no';

  export type Order = {
    id: number;
    date_order: string;
    amount_total: number;
    invoice_status: OrderInvoiceStatus;
    display_name: string;
    invoice_ids: number[];
  };
}
