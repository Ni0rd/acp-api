import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';
import { OdooEvent, OdooAddress } from '../../../api/@types/odoo';

addGlobalMocks();
const getClient = initApollo();

jest.mock('../../../api/datasources/Odoo', () => {
  const odooEvent: OdooEvent = {
    id: 1,
    name: 'fake event',
    description: 'the event description',
    date_begin: '2020-01-05',
    date_end: '2020-01-05',
    address_id: 1,
    event_type_id: 1,
  };
  const odooAddress: OdooAddress = {
    id: 1,
    name: 'address name',
    street: '1, rue de Montmartre',
    street2: '',
    town: 'Paris',
    state: '',
    zipCode: '75001',
    country: 'France',
  };
  return jest.fn().mockImplementation(() => {
    return {
      getEventById: jest.fn().mockResolvedValue(odooEvent),
      getEventAddress: jest.fn().mockResolvedValue(odooAddress),
    };
  });
});

describe('event query', () => {
  test('returns the Event', async () => {
    const query = {
      query: gql`
        query($eventId: PositiveInt!) {
          event(eventId: $eventId) {
            id
            planCategoriesIds
            typeId
            dateBegin
            dateEnd
            title
            image
            description
            address {
              name
              street
              street2
              town
              state
              zipCode
              country
            }
          }
        }
      `,
      variables: {
        eventId: 1,
      },
    };
    const response = await getClient().query(query);
    expect(response).toMatchSnapshot();
  });
});
