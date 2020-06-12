import { OdooAddress } from '../@types/odoo';
import { Address } from '../@types/resolverTypes';

export function odooAddressReducer(odooAddress: OdooAddress): Address {
  return {
    id: odooAddress.id,
    name: odooAddress.name,
    street: odooAddress.street,
    street2: odooAddress.street2,
    city: odooAddress.city,
    zipCode: odooAddress.zip,
  };
}
