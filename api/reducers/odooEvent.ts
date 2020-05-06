import { OdooEvent } from '../@types/odoo';
import { Event } from '../@types/resolverTypes';

export function odooEventReducer(odooEvent: OdooEvent): Event {
  return {
    id: odooEvent.id,
    title: odooEvent.name,
    description: odooEvent.description,
    planCategoriesIds: [],
    typeId: odooEvent.event_type_id,
    image: null,
    dateBegin: new Date(odooEvent.date_begin),
    dateEnd: new Date(odooEvent.date_end),
  };
}
