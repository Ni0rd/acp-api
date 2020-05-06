import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';
import { OdooOrder, OdooInvoice } from '../../../api/@types/odoo';
import { TokenPayload } from '../../../api/@types/types';

addGlobalMocks();
const getClient = initApollo();

jest.mock('../../../api/utils/auth', () => {
  const tokenPayload: TokenPayload = {
    odooUserId: 1,
  };
  return {
    getDecodedTokenFromHeaders: jest.fn().mockReturnValue(tokenPayload),
  };
});

jest.mock('../../../api/datasources/Odoo', () => {
  const odooOrder: OdooOrder = {
    id: 1,
    date_order: '2020-01-05',
    amount_total: 150.0,
    invoice_status: 'invoiced',
    display_name: 'fake invoice',
    invoice_ids: [1, 2],
  };
  const odooInvoices: OdooInvoice[] = [
    {
      id: 1,
      invoice_payment_state: 'paid',
      invoice_date: '2020-01-05',
      amount_total: 100.0,
    },
    {
      id: 2,
      invoice_payment_state: 'paid',
      invoice_date: '2020-01-05',
      amount_total: 150.0,
    },
  ];
  return jest.fn().mockImplementation(() => {
    return {
      getUserOrders: jest.fn().mockResolvedValue([odooOrder]),
      getOrderById: jest.fn().mockResolvedValue(odooOrder),
      getInvoicesByIds: jest.fn().mockResolvedValue(odooInvoices),
    };
  });
});

describe('myOrders query', () => {
  test('returns the User Orders', async () => {
    const query = {
      query: gql`
        query {
          myOrders {
            id
            date
            total
            invoices {
              id
              state
              total
              date
            }
          }
        }
      `,
      context: {
        headers: {
          authorization: 'token 123abc',
        },
      },
    };
    const response = await getClient().query(query);
    expect(response).toMatchSnapshot();
  });
});
