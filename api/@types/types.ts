import { IncomingMessage, ServerResponse } from 'http';
import OdooDataSource from '../datasources/Odoo';
import WordpressDataSource from '../datasources/Wordpress';

export type Lang = 'fr' | 'en';

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  odooUserId: number | null;
  dataSources: DataSources<Context>;
  jwtConfig: JwtConfig;
  lang: Lang;
};

export type DataSources<TContext> = {
  odoo: OdooDataSource<TContext>;
  wordpress: WordpressDataSource<TContext>;
};

export type JwtConfig = {
  secret: string;
  durationDays: number;
};

export type TokenPayload = {
  odooUserId: number;
};
