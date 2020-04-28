import { Lang } from '../types';
import eventTypesData from '../../data/eventTypes';

export default class EventType {
  id: number;

  title: string;

  constructor(data: { id: number; title: string }) {
    this.id = data.id;
    this.title = data.title;
  }

  static getAll(lang: Lang): Promise<Array<EventType>> {
    const eventTypes = eventTypesData.map((eventTypeData) => {
      return new EventType({
        id: eventTypeData.id,
        title: eventTypeData.title[lang],
      });
    });

    return Promise.resolve(eventTypes);
  }
}
