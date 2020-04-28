import userOrdersData from '../../data/userOrders';
import userBookingsData from '../../data/userBookings';
import {
  models as OdooModels,
  methods as OdooMethods,
} from '../lib/odoo-xmlrpc';
import { login as wordpressLogin } from '../lib/wordpress';
import odoo from '../odoo';
import Order from './Order';
import Booking from './Booking';

export default class User {
  id: number;

  firstname: string;

  lastname: string;

  email: string;

  constructor(data: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  }) {
    this.id = data.id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
  }

  static async login(credentials: {
    username: string;
    password: string;
  }): Promise<User | null> {
    const userId = await odoo.authenticate(credentials);
    // The credentials matched
    if (userId) {
      return User.getOne(userId);
    }
    // The credentials did not match an Odoo user, run the Wordpress Login Migration flow.
    return User.processWordpressLoginMigration(credentials);
  }

  static async processWordpressLoginMigration(credentials: {
    username: string;
    password: string;
  }): Promise<User | null> {
    // Attempt to login to WP
    const validCredentials = await wordpressLogin(
      process.env.WP_API_ENDPOINT as string,
      credentials
    );

    // Credentials are not valid on Wordpress
    if (!validCredentials) {
      return null;
    }

    // Fetch Odoo user id with username
    const userId = await User.getUserIdWithUsername(credentials.username);

    // Odoo user does not exist
    if (!userId) {
      return null;
    }

    const user = await User.getOne(userId);

    // Should not happen.
    if (!user) {
      return null;
    }

    // Update Odoo user password
    await user.updatePassword(credentials.password);

    return user;
  }

  static async getUserIdWithUsername(username: string): Promise<number> {
    const [userId] = await odoo.executeKwAsAdmin({
      model: OdooModels.USERS,
      method: OdooMethods.SEARCH,
      data: [[['email', '=', username]]],
    });
    return userId;
  }

  async updatePassword(newPassword: string): Promise<void> {
    await odoo.executeKwAsAdmin({
      model: OdooModels.USERS,
      method: OdooMethods.WRITE,
      data: [
        [this.id],
        {
          password: newPassword,
        },
      ],
    });
  }

  static async getOne(userId: number): Promise<User | null> {
    const [data] = await odoo.executeKwAsAdmin({
      model: OdooModels.USERS,
      method: OdooMethods.READ,
      data: [userId],
      options: { fields: ['name', 'email'] },
    });
    if (!data) {
      return null;
    }
    const name = data.name || '';
    const [firstname, lastname] = name.split(' ');
    return new User({
      id: userId,
      email: data.email,
      firstname,
      lastname,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getOrders(): Promise<Array<Order>> {
    const orders = userOrdersData.map((data) => {
      return new Order(data);
    });
    return Promise.resolve(orders);
  }

  // eslint-disable-next-line class-methods-use-this
  async getBookings(): Promise<Array<Booking>> {
    const bookings = userBookingsData.map((data) => {
      return new Booking(data);
    });
    return Promise.resolve(bookings);
  }

  async getEventBooking(eventId: number): Promise<Booking | undefined> {
    const bookings = await this.getBookings();
    return bookings.find((aBooking) => {
      return aBooking.event.id === eventId;
    });
  }
}
