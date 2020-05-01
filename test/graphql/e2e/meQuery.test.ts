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

jest.mock('../../../api/datasources/OdooUser', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUserById: jest.fn().mockResolvedValue({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.net',
      }),
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
