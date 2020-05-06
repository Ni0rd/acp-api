import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';
import { OdooEventType } from '../../../api/@types/odoo';

addGlobalMocks();
const getClient = initApollo();

jest.mock('../../../api/datasources/Odoo', () => {
  const odooEventType: OdooEventType = {
    id: 1,
    name: 'fake event type',
  };
  return jest.fn().mockImplementation(() => {
    return {
      getEventTypes: jest.fn().mockResolvedValue([odooEventType]),
    };
  });
});

describe('eventTypes query', () => {
  test('returns the EventsTypes', async () => {
    const query = {
      query: gql`
        query {
          eventTypes {
            id
            title
          }
        }
      `,
    };
    const response = await getClient().query(query);
    expect(response).toMatchSnapshot();
  });
});
