import { DataSource, DataSourceConfig } from 'apollo-datasource';
import OdooXmlrpc from '../lib/odoo-xmlrpc';

export default class OdooDataSource<TContext> extends DataSource {
  public context!: TContext;

  public odoo!: OdooXmlrpc;

  constructor(odooConfig: OdooXmlrpc.Config) {
    super();
    this.odoo = new OdooXmlrpc(odooConfig);
  }

  initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
  }

  authenticate(
    credentials: OdooXmlrpc.UserCredentials
  ): Promise<number | null> {
    return this.odoo.authenticate(credentials);
  }
}
