import Odoo from './lib/odoo-xmlrpc';

export default new Odoo({
  host: process.env.ODOO_HOST as string,
  database: process.env.ODOO_DATABASE as string,
  adminCredentials: {
    userId: Number.parseInt(process.env.ODOO_ADMIN_USER_ID as string, 10),
    username: process.env.ODOO_ADMIN_USERNAME as string,
    password: process.env.ODOO_ADMIN_PASSWORD as string,
  },
});
