import { IncomingHttpHeaders } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import { TokenPayload, DataSources, Context } from '../@types/types';
import { User } from '../@types/resolverTypes';
import { odooUserReducer } from '../reducers/odooUser';

async function getUserByOdooUserId(
  dataSources: DataSources<Context>,
  odooUserId: number
): Promise<User | null> {
  const odooUser = await dataSources.odoo.getUserById(odooUserId);
  if (!odooUser) {
    return null;
  }
  return odooUserReducer(odooUser);
}

export async function login(
  credentials: { username: string; password: string },
  dataSources: DataSources<Context>
): Promise<User | null> {
  // Attempt to login to Odoo
  let odooUserId = await dataSources.odoo.authenticate(credentials);

  // The credentials matched, return the Odoo user
  if (odooUserId) {
    return getUserByOdooUserId(dataSources, odooUserId);
  }

  // Attempt to login to WP
  const validCredentials = await dataSources.wordpress.login(credentials);

  // Credentials are not valid on Wordpress
  if (!validCredentials) {
    return null;
  }

  // Fetch Odoo user id with username
  odooUserId = await dataSources.odoo.getUserIdByUsername(credentials.username);

  // Odoo user does not exist
  if (!odooUserId) {
    return null;
  }

  // Update Odoo user password
  await dataSources.odoo.updateUserPassword(odooUserId, credentials.password);

  // Return Odoo user
  return getUserByOdooUserId(dataSources, odooUserId);
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
