import { Server } from 'http';
import listen from 'test-listen';
import micro, { RequestHandler } from 'micro';

export async function setupServer(
  handler: RequestHandler
): Promise<{ server: Server; url: string }> {
  const server = micro(handler);
  const url = await listen(server);
  return { server, url };
}

export function tearDownServer(server: Server): void {
  server.close();
}
