import Event from './Event';

export default class Booking {
  id: number;

  event: Event;

  constructor(data: { id: number; event: Event }) {
    this.id = data.id;
    this.event = data.event;
  }
}
