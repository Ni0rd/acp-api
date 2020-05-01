import { IncomingHttpHeaders } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import { TokenPayload, DataSources, Context } from '../@types/types';
import { User } from '../@types/resolverTypes';

export async function login(
  credentials: { username: string; password: string },
  dataSources: DataSources<Context>
): Promise<User | null> {
  // Attempt to login to Odoo
  let userId = await dataSources.odooUser.authenticate(credentials);

  // The credentials matched, return the Odoo user
  if (userId) {
    return dataSources.odooUser.getUserById(userId);
  }

  // Attempt to login to WP
  const validCredentials = await dataSources.wordpress.login(credentials);

  // Credentials are not valid on Wordpress
  if (!validCredentials) {
    return null;
  }

  // Fetch Odoo user id with username
  userId = await dataSources.odooUser.getUserIdByUsername(credentials.username);

  // Odoo user does not exist
  if (!userId) {
    return null;
  }

  // Update Odoo user password
  await dataSources.odooUser.updateUserPassword(userId, credentials.password);

  // Return Odoo user
  return dataSources.odooUser.getUserById(userId);
}

export function signToken(
  jwtSecret: string,
  tokenDurationDays: number,
  payload: TokenPayload
): string {
  return jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn: `${tokenDurationDays}d`,
  });
}

export function decodeToken(
  jwtSecret: string,
  encodedToken: string
): TokenPayload | null {
  try {
    return jsonwebtoken.verify(encodedToken, jwtSecret) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function getEncodedTokenFromHeaders(
  headers: IncomingHttpHeaders
): string | null {
  const { authorization } = headers;
  if (!authorization) {
    return null;
  }
  return authorization.split(' ').pop() || null;
}

export function getDecodedTokenFromHeaders(
  jwtSecret: string,
  headers: IncomingHttpHeaders
): TokenPayload | null {
  const encodedToken = getEncodedTokenFromHeaders(headers);
  if (!encodedToken) {
    return null;
  }
  return decodeToken(jwtSecret, encodedToken);
}
