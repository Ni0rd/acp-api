import { OdooUser } from '../@types/odoo';
import { User } from '../@types/resolverTypes';

export function odooUserReducer(data: OdooUser): User {
  return {
    id: data.id,
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
  };
}
