import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';

addGlobalMocks();
const getClient = initApollo();

jest.mock('../../../api/utils/auth', () => {
  return {
    getDecodedTokenFromHeaders: jest.fn().mockReturnValue({
      userId: 1,
    }),
  };
});

jest.mock('../../../api/datasources/OdooOrder', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUserOrders: jest.fn().mockResolvedValue([
        {
          id: 1,
          date: new Date('2020-01-05'),
          total: 200.0,
          invoices: [
            {
              id: 1,
              state: 'PAID',
              total: 150.0,
              date: new Date('2020-01-05'),
            },
          ],
        },
      ]),
    };
  });
});

describe('myOrders query', () => {
  test('returns the User Orders', async () => {
    const query = {
      query: gql`
        query($lang: Lang!) {
          myOrders(lang: $lang) {
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
      variables: {
        lang: 'fr',
      },
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
