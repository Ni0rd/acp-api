import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';
import { OdooUser } from '../../../api/@types/odoo';
import { TokenPayload } from '../../../api/@types/types';

addGlobalMocks();
const getClient = initApollo();

jest.mock('../../../api/utils/auth', () => {
  return {
    getDecodedTokenFromHeaders: jest.fn().mockReturnValue({
      odooUserId: 1,
    } as TokenPayload),
  };
});

jest.mock('../../../api/datasources/Odoo', () => {
  const odooUser: OdooUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.net',
  };
  return jest.fn().mockImplementation(() => {
    return {
      getUserById: jest.fn().mockResolvedValue(odooUser),
    };
  });
});

describe('me query', () => {
  test('returns the User', async () => {
    const query = {
      query: gql`
        query {
          me {
            id
            email
            firstname
            lastname
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
