import { Context } from './@types/types';
import { getDecodedTokenFromHeaders } from './utils/auth';

export function getContext(ctx: Context): Context {
  ctx.jwtConfig = {
    secret: process.env.JWT_SECRET as string,
    durationDays: 365,
  };
  const token = getDecodedTokenFromHeaders(
    ctx.jwtConfig.secret,
    ctx.req.headers
  );
  if (token) {
    ctx.userId = token.userId;
  }
  return ctx;
}
