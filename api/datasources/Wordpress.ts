import { RESTDataSource } from 'apollo-datasource-rest';

export default class WordpressDataSource<TContext> extends RESTDataSource<
  TContext
> {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }

  login(credentials: {
    username: string;
    password: string;
  }): Promise<string | false> {
    return this.post('jwt-auth/v1/token', credentials);
  }
}
