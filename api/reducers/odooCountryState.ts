import { OdooCountryState } from '../@types/odoo';
import { CountryState } from '../@types/resolverTypes';

export function odooCountryStateReducer(
  odooCountryState: OdooCountryState
): CountryState {
  return {
    id: odooCountryState.id,
    name: odooCountryState.name,
    code: odooCountryState.code,
  };
}
