import { Lang, Location, File } from '../types';
import eventsData from '../../data/events';
import EventType from './EventType';
import User from './User';

export default class Event {
  id: number;

  image: string;

  title: string;

  slug: string;

  subtitle: string;

  description: string;

  type?: EventType;

  planCategorieIds: Array<number>;

  location: Location;

  date: Date;

  link: string;

  pdf: File;

  constructor(data: {
    id: number;
    image: string;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    type?: EventType;
    planCategorieIds: Array<number>;
    location: Location;
    date: Date;
    link: string;
    pdf: File;
  }) {
    this.id = data.id;
    this.image = data.image;
    this.title = data.title;
    this.slug = data.slug;
    this.subtitle = data.subtitle;
    this.description = data.description;
    this.type = data.type;
    this.planCategorieIds = data.planCategorieIds;
    this.location = data.location;
    this.date = data.date;
    this.link = data.link;
    this.pdf = data.pdf;
  }

  static async getAll(
    lang: Lang,
    filters: {
      eventTypes?: Array<number>;
    } = {}
  ): Promise<Array<Event>> {
    const eventTypes = await EventType.getAll(lang);

    let events = eventsData.map((eventData) => {
      const eventType = eventTypes.find((anEventType) => {
        return anEventType.id === eventData.typeId;
      });

      return new Event({
        id: eventData.id,
        image: eventData.image,
        title: eventData.title[lang],
        slug: eventData.slug[lang],
        subtitle: eventData.subtitle[lang],
        description: eventData.description[lang],
        type: eventType,
        planCategorieIds: eventData.planCategorieIds,
        location: eventData.location,
        date: new Date(eventData.date),
        link: eventData.link,
        pdf: {
          url: eventData.pdf.url,
          title: eventData.pdf.title[lang],
        },
      });
    });

    // Apply filters
    if (filters.eventTypes) {
      events = events.filter((event) => {
        return event.type && filters.eventTypes?.includes(event.type.id);
      });
    }

    return Promise.resolve(events);
  }

  static async getOne(lang: Lang, eventId: number): Promise<Event | undefined> {
    const events = await Event.getAll(lang);
    return events.find((anEvent) => {
      return anEvent.id === eventId;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  isFull(): Promise<boolean> {
    return Promise.resolve(false);
  }

  // eslint-disable-next-line class-methods-use-this
  async isBooked(userId: number): Promise<boolean> {
    const user = await User.getOne(userId);
    if (!user) {
      return false;
    }
    const booking = await user.getEventBooking(this.id);
    return !!booking;
  }
}
