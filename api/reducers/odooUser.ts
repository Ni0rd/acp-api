import { OdooUser } from '../@types/odoo';
import { User } from '../@types/resolverTypes';

export function odooUserReducer(data: OdooUser): User {
  const name = data.name || '';
  const [firstname, lastname] = name.split(' ');
  return {
    id: data.id,
    email: data.email,
    firstname,
    lastname,
  };
}
