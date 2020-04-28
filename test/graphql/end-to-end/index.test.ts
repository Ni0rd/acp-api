import './env';
import { Server } from 'http';
import fetch from 'cross-fetch';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setupServer } from './helpers';
import handler from '../../../api/graphql';

let server!: Server;
let handlerUrl!: string;
let client: ApolloClient<NormalizedCacheObject>;

beforeEach(async () => {
  const result = await setupServer(handler);
  server = result.server;
  handlerUrl = result.url;

  const cache = new InMemoryCache();
  const link = new HttpLink({
    fetch,
    uri: `${handlerUrl}/graphql`,
  });
  client = new ApolloClient({
    cache,
    link,
  });
});

afterEach(() => {
  server.close();
});

describe('GraphQL Handler', () => {
  test('Returns the plan categories', async () => {
    const response = await client.query({
      query: gql`
        query($lang: Lang!) {
          planCategories(lang: $lang) {
            id
          }
        }
      `,
      variables: {
        lang: 'fr',
      },
    });
    expect(response).toMatchSnapshot();
  });
});
