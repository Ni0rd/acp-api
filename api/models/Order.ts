import { File } from '../types';

enum OrderStatus {
  WAITING,
  COMPLETE,
}

export default class Order {
  id: number;

  status: OrderStatus;

  date: Date;

  total: number;

  invoice: File;

  taxReceipt: File;

  constructor(data: {
    id: number;
    status: OrderStatus;
    date: Date;
    total: number;
    invoice: File;
    taxReceipt: File;
  }) {
    this.id = data.id;
    this.status = data.status;
    this.date = data.date;
    this.total = data.total;
    this.invoice = data.invoice;
    this.taxReceipt = data.taxReceipt;
  }
}
