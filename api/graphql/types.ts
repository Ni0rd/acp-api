import { IncomingMessage, ServerResponse } from 'http';

export interface Context {
  req: IncomingMessage;
  res: ServerResponse;
  userId: number | null;
}
