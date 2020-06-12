import './env';
import gql from 'graphql-tag';
import { addGlobalMocks, initApollo } from './helpers';
import {
  OdooEvent,
  OdooAddress,
  OdooCountry,
  OdooCountryState,
} from '../../../api/@types/odoo';

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
    city: 'Paris',
    state_id: 123,
    zip: '75001',
    country_id: 123,
  };
  const odooCountry: OdooCountry = {
    id: 123,
    name: 'France',
    code: 'fr',
  };
  const odooState: OdooCountryState = {
    id: 123,
    name: 'Ile de France',
    code: 'xx',
  };
  return jest.fn().mockImplementation(() => {
    return {
      getEvents: jest.fn().mockResolvedValue([odooEvent]),
      getEventAddress: jest.fn().mockResolvedValue(odooAddress),
      getAddressById: jest.fn().mockResolvedValue(odooAddress),
      getCountryById: jest.fn().mockResolvedValue(odooCountry),
      getCountryStateById: jest.fn().mockResolvedValue(odooState),
    };
  });
});

describe('events query', () => {
  test('returns the Events', async () => {
    const query = {
      query: gql`
        query {
          events {
            id
            planCategoriesIds
            typeId
            dateBegin
            dateEnd
            title
            imageUrl
            description
            address {
              name
              street
              street2
              city
              state {
                id
                name
                code
              }
              zipCode
              country {
                id
                name
                code
              }
            }
          }
        }
      `,
    };
    const response = await getClient().query(query);
    expect(response).toMatchSnapshot();
  });
});
