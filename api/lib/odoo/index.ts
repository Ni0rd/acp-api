import xmlrpc from 'xmlrpc';
import models from './models';
import methods from './methods';

export { models, methods };

interface AdminCredentials {
  userId: number;
  username: string;
  password: string;
}

export default class OdooXmlrpc {
  host: string;

  database: string;

  adminCredentials: AdminCredentials;

  constructor(config: {
    host: string;
    database: string;
    adminCredentials: AdminCredentials;
  }) {
    this.host = config.host;
    this.database = config.database;
    this.adminCredentials = config.adminCredentials;
  }

  createClient(options: { path: string }): xmlrpc.Client {
    const clientOptions = {
      host: this.host,
      ...options,
    };
    return xmlrpc.createSecureClient(clientOptions);
  }

  authenticate(params: {
    username: string;
    password: string;
  }): Promise<number | null> {
    const client = this.createClient({
      path: '/xmlrpc/2/common',
    });
    const methodParams = [this.database, params.username, params.password, {}];
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

  executeKw(params: {
    userId: number;
    password: string;
    model: string;
    method: string;
    data: any;
    options?: {};
  }): Promise<any> {
    const client = this.createClient({
      path: '/xmlrpc/2/object',
    });
    const methodParams = [
      this.database,
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

  executeKwAsAdmin(params: {
    model: string;
    method: string;
    data: any;
    options?: {};
  }): Promise<any> {
    return this.executeKw({
      userId: this.adminCredentials.userId,
      password: this.adminCredentials.password,
      ...params,
    });
  }
}
