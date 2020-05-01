import xmlrpc from 'xmlrpc';

export default class OdooXmlrpc {
  private config: OdooXmlrpc.Config;

  private clients: {
    [path: string]: xmlrpc.Client;
  };

  constructor(config: OdooXmlrpc.Config) {
    this.config = config;
    this.clients = {};
  }

  private createClient(options: { path: string }): xmlrpc.Client {
    if (this.clients[options.path]) {
      return this.clients[options.path];
    }
    const clientOptions = {
      host: this.config.host,
      ...options,
    };
    const client = xmlrpc.createSecureClient(clientOptions);
    this.clients[options.path] = client;
    return client;
  }

  authenticate(
    credentials: OdooXmlrpc.UserCredentials
  ): Promise<number | null> {
    const client = this.createClient({
      path: '/xmlrpc/2/common',
    });
    const methodParams = [
      this.config.database,
      credentials.username,
      credentials.password,
      {},
    ];
    return new Promise((resolve, reject) => {
      client.methodCall('authenticate', methodParams, (err, userId) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(userId);
      });
    });
  }

  executeKw(params: OdooXmlrpc.KwParams): Promise<OdooXmlrpc.KwResponse> {
    const client = this.createClient({
      path: '/xmlrpc/2/object',
    });
    const methodParams = [
      this.config.database,
      params.userId,
      params.password,
      params.model,
      params.method,
      params.data,
      params.options || {},
    ];
    return new Promise((resolve, reject) => {
      client.methodCall('execute_kw', methodParams, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  executeKwAsAdmin(
    params: OdooXmlrpc.KwAsAdminParams
  ): Promise<OdooXmlrpc.KwResponse> {
    return this.executeKw({
      userId: this.config.adminCredentials.userId,
      password: this.config.adminCredentials.password,
      ...params,
    });
  }

  executeReadAsAdmin(
    params: OdooXmlrpc.ReadParams
  ): Promise<OdooXmlrpc.ReadResponse> {
    return this.executeKwAsAdmin({
      method: 'read',
      model: params.model,
      data: params.ids,
      options: {
        fields: params.fields,
      },
    }) as Promise<OdooXmlrpc.ReadResponse>;
  }

  executeSearchAsAdmin(
    params: OdooXmlrpc.SearchParams
  ): Promise<OdooXmlrpc.SearchResponse> {
    return this.executeKwAsAdmin({
      method: 'search',
      model: params.model,
      data: [],
      options: {
        offset: params.options?.offset || 0,
        limit: params.options?.limit || this.config.defaultLimit,
      },
    }) as Promise<OdooXmlrpc.SearchResponse>;
  }
}
