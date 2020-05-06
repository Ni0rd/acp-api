import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';
import { User } from '../../../api/@types/resolverTypes';

addGlobalMocks();
const getClient = initApollo();

jest.mock('../../../api/utils/auth', () => {
  const user: User = {
    id: 1,
    email: 'email@example.com',
    firstname: 'John',
    lastname: 'Doe',
  };
  return {
    login: jest.fn().mockResolvedValue(user),
    signToken: jest.fn().mockResolvedValue('abcdefg'),
    getDecodedTokenFromHeaders: jest.fn().mockReturnValue(null),
  };
});

describe('login mutation', () => {
  test('returns a LoginResult', async () => {
    const mutation = {
      mutation: gql`
        mutation($email: EmailAddress!, $password: String!) {
          login(email: $email, password: $password) {
            token
            me {
              id
              email
              firstname
              lastname
            }
          }
        }
      `,
      variables: {
        email: 'email@example.com',
        password: '123456',
      },
    };
    const response = await getClient().mutate(mutation);
    expect(response).toMatchSnapshot();
  });
});
