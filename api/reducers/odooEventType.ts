import { OdooEventType } from '../@types/odoo';
import { EventType } from '../@types/resolverTypes';

export function odooEventTypeReducer(odooEventType: OdooEventType): EventType {
  return {
    id: odooEventType.id,
    title: odooEventType.name,
  };
}
