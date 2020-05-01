import { IncomingMessage, ServerResponse } from 'http';
// import OdooEventDataSource from '../datasources/OdooEvent';
// import OdooEventTypeDataSource from '../datasources/OdooEventType';
import OdooOrderDataSource from '../datasources/OdooOrder';
// import OdooPlanCategoryDataSource from '../datasources/OdooPlanCategory';
import OdooUserDataSource from '../datasources/OdooUser';
import WordpressDataSource from '../datasources/Wordpress';

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  userId: number | null;
  dataSources: DataSources<Context>;
  jwtConfig: JwtConfig;
};

export type DataSources<TContext> = {
  // odooEvent: OdooEventDataSource;
  // odooEventType: OdooEventTypeDataSource;
  odooOrder: OdooOrderDataSource<TContext>;
  // odooPlanCategory: OdooPlanCategoryDataSource;
  odooUser: OdooUserDataSource<TContext>;
  wordpress: WordpressDataSource<TContext>;
};

export type JwtConfig = {
  secret: string;
  durationDays: number;
};

export type TokenPayload = {
  userId: number;
};
