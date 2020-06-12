import { OdooCountry } from '../@types/odoo';
import { Country } from '../@types/resolverTypes';

export function odooCountryReducer(odooCountry: OdooCountry): Country {
  return {
    id: odooCountry.id,
    name: odooCountry.name,
    code: odooCountry.code,
  };
}
