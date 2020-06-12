import { Context } from '../../../../api/@types/types';
import OdooDataSource from '../../../../api/datasources/Odoo';
import OdooXmlrpc from '../../../../api/lib/odoo-xmlrpc';

jest.mock('../../../../api/lib/odoo-xmlrpc');

const mockExecuteReadAsAdmin = jest
  .fn()
  .mockImplementation(({ ids }: { ids: number[] }) => {
    return Promise.resolve(ids.map(() => ({})));
  });

(OdooXmlrpc as jest.Mock).mockImplementation(() => {
  return {
    executeReadAsAdmin: mockExecuteReadAsAdmin,
  };
});

const odooConfig = {
  host: '',
  database: '',
  adminCredentials: {
    userId: 1,
    username: '',
    password: '',
  },
  defaultLimit: 10,
};

let odoo: OdooDataSource<Context>;

beforeEach(() => {
  mockExecuteReadAsAdmin.mockClear();
  odoo = new OdooDataSource<Context>(odooConfig);
});

describe('Odoo DataSource', () => {
  describe('Orders', () => {
    test('dedups requests', async () => {
      await Promise.all([
        odoo.getOrderById(1),
        odoo.getOrderById(1),
        odoo.getOrderById(2),
        odoo.getOrderById(3),
      ]);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });

    test('caches requests', async () => {
      await odoo.getOrderById(1);
      await odoo.getOrderById(1);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Events', () => {
    test('dedups requests', async () => {
      await Promise.all([
        odoo.getEventById(1),
        odoo.getEventById(1),
        odoo.getEventById(2),
        odoo.getEventById(3),
      ]);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });

    test('caches requests', async () => {
      await odoo.getEventById(1);
      await odoo.getEventById(1);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Addresses', () => {
    test('dedups requests', async () => {
      await Promise.all([
        odoo.getAddressById(1),
        odoo.getAddressById(1),
        odoo.getAddressById(2),
        odoo.getAddressById(3),
      ]);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });

    test('caches requests', async () => {
      await odoo.getAddressById(1);
      await odoo.getAddressById(1);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Users', () => {
    test('dedups requests', async () => {
      await Promise.all([
        odoo.getUserById(1),
        odoo.getUserById(1),
        odoo.getUserById(2),
        odoo.getUserById(3),
      ]);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });

    test('caches requests', async () => {
      await odoo.getUserById(1);
      await odoo.getUserById(1);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });
  });

  describe('EventTypes', () => {
    test('dedups requests', async () => {
      await Promise.all([
        odoo.getEventTypeById(1),
        odoo.getEventTypeById(1),
        odoo.getEventTypeById(2),
        odoo.getEventTypeById(3),
      ]);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });

    test('caches requests', async () => {
      await odoo.getEventTypeById(1);
      await odoo.getEventTypeById(1);
      expect(mockExecuteReadAsAdmin).toHaveBeenCalledTimes(1);
    });
  });
});
