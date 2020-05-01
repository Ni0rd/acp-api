// import OdooEventDataSource from './datasources/OdooEvent';
// import OdooEventTypeDataSource from './datasources/OdooEventType';
import OdooOrderDataSource from './datasources/OdooOrder';
// import OdooPlanCategoryDataSource from './datasources/OdooPlanCategory';
import OdooUserDataSource from './datasources/OdooUser';
import WordpressDataSource from './datasources/Wordpress';
import { DataSources, Context } from './@types/types';

const odooConfig = {
  host: process.env.ODOO_HOST as string,
  database: process.env.ODOO_DATABASE as string,
  adminCredentials: {
    userId: Number.parseInt(process.env.ODOO_ADMIN_USER_ID as string, 10),
    username: process.env.ODOO_ADMIN_USERNAME as string,
    password: process.env.ODOO_ADMIN_PASSWORD as string,
  },
  defaultLimit: 10,
};

const wordpressApiEndpoint = process.env.WP_API_ENDPOINT as string;

export const datasources: DataSources<Context> = {
  // odooEvent: new OdooEventDataSource(odooConfig),
  // odooEventType: new OdooEventTypeDataSource(odooConfig),
  odooOrder: new OdooOrderDataSource(odooConfig),
  // odooPlanCategory: new OdooPlanCategoryDataSource(odooConfig),
  odooUser: new OdooUserDataSource(odooConfig),
  wordpress: new WordpressDataSource(wordpressApiEndpoint),
};

export function getDatasources(): DataSources<Context> {
  return datasources;
}
