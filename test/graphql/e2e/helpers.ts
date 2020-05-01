import { Server } from 'http';
import fetch from 'cross-fetch';
import listen from 'test-listen';
import micro from 'micro';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import handler from '../../../api';

export function addGlobalMocks(): void {
  const modules = [
    '../../../api/lib/odoo-xmlrpc',
    '../../../api/lib/wordpress',
  ];
  beforeEach(() => {
    modules.forEach((path) => jest.mock(path));
  });

  afterEach(() => {
    modules.forEach((path) => jest.unmock(path));
  });
}

export function initApollo(): () => ApolloClient<NormalizedCacheObject> {
  let server!: Server;
  let handlerUrl: string;

  beforeEach(async () => {
    server = micro(handler);
    handlerUrl = await listen(server);
  });

  afterEach(() => {
    server.close();
  });

  const getClient = (): ApolloClient<NormalizedCacheObject> => {
    const cache = new InMemoryCache();
    const link = new HttpLink({
      fetch,
      uri: `${handlerUrl}/graphql`,
    });
    return new ApolloClient({
      cache,
      link,
    });
  };

  return getClient;
}
