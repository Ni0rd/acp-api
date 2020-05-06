declare namespace OdooXmlrpc {
  export interface AdminCredentials {
    userId: number;
    username: string;
    password: string;
  }

  export interface Config {
    host: string;
    database: string;
    adminCredentials: AdminCredentials;
    defaultLimit: number;
  }

  export interface UserCredentials {
    username: string;
    password: string;
  }

  export type Filters = (Filter | LogicalOperator)[];

  export type Filter = [
    string,
    Operator,
    string | number | string[] | number[]
  ];

  export type Fields = string[];

  export type Method =
    | 'search'
    | 'search_count'
    | 'read'
    | 'fields_get'
    | 'search_read'
    | 'create'
    | 'write'
    | 'unlink';

  export type Operator =
    | '='
    | '!='
    | '>'
    | '>='
    | '<'
    | '<='
    | '=?'
    | '=like'
    | '=ilike'
    | 'like'
    | 'ilike'
    | 'not like'
    | 'not ilike'
    | 'in'
    | 'not in'
    | 'child_of'
    | 'parent_of';

  export type LogicalOperator = '&' | '|' | '!';

  export type SearchParams = {
    model: string;
    filters: Filters;
    options?: {
      offset?: number;
      limit?: number;
    };
  };

  export type SearchResponse = number[];

  export type ReadParams = {
    model: string;
    ids: number[];
    fields: Fields;
  };

  export type ReadResponse = {
    [key: string]: string | number | number[];
  }[];

  export type KwParams = {
    userId: number;
    password: string;
    model: string;
    method: Method;
    data: unknown;
    options?: {};
  };

  export type KwAsAdminParams = {
    model: string;
    method: Method;
    data: unknown;
    options?: {};
  };

  export type KwResponse = SearchResponse | ReadResponse;
}
