import { OdooAddress } from '../@types/odoo';
import { Address } from '../@types/resolverTypes';

export function odooAddressReducer(odooAddress: OdooAddress): Address {
  return {
    name: odooAddress.name,
    street: odooAddress.street,
    street2: odooAddress.street2,
    town: odooAddress.town,
    state: odooAddress.state,
    zipCode: odooAddress.zipCode,
    country: odooAddress.country,
  };
}
