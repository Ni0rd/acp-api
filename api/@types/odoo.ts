export type OdooLang = 'fr' | 'en';

export type OdooUser = {
  id: number;
  email: string;
  name: string;
};

export type OdooInvoiceState = 'not_paid' | 'in_payment' | 'paid';

export type OdooInvoice = {
  id: number;
  invoice_payment_state: OdooInvoiceState;
  invoice_date: string;
  amount_total: number;
};

type OdooOrderInvoiceStatus = 'upselling' | 'invoiced' | 'to invoice' | 'no';

export type OdooOrder = {
  id: number;
  date_order: string;
  amount_total: number;
  invoice_status: OdooOrderInvoiceStatus;
  display_name: string;
  invoice_ids: number[];
};

export type OdooAddress = {
  id: number;
  name: string;
  street: string;
  street2: string;
  city: string;
  state_id: number;
  zip: string;
  country_id: number;
};

export type OdooCountryState = {
  id: number;
  name: string;
  code: string;
};

export type OdooCountry = {
  id: number;
  name: string;
  code: string;
};

export type OdooEvent = {
  id: number;
  name: string;
  description: string;
  date_begin: string;
  date_end: string;
  address_id?: number;
  event_type_id: number;
};

export type OdooEventType = {
  id: number;
  name: string;
};

export type OdooEventsFilters = {
  eventTypes: number[];
};
