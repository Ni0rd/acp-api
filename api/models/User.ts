import { models as OdooModels, methods as OdooMethods } from '../lib/odoo';
import odoo from '../odoo';
import { login as wordpressLogin } from '../lib/wordpress';

export default class User {
  id?: number;

  firstname?: string;

  lastname?: string;

  email?: string;

  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }

  static async login(credentials: {
    username: string;
    password: string;
  }): Promise<User | null> {
    const userId = await odoo.authenticate(credentials);
    if (userId) {
      return new User(userId);
    }
    return User.processWordpressLoginMigration(credentials);
  }

  static async processWordpressLoginMigration(credentials: {
    username: string;
    password: string;
  }): Promise<User | null> {
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

    const user = new User(userId);
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

  updatePassword(newPassword: string): Promise<any> {
    return odoo.executeKwAsAdmin({
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

  async fetchData(): Promise<void> {
    const [data] = await odoo.executeKwAsAdmin({
      model: OdooModels.USERS,
      method: OdooMethods.READ,
      data: [this.id],
      options: { fields: ['name', 'email'] },
    });
    if (!data) {
      return;
    }
    this.email = data.email;
    const name = data.name || '';
    [this.firstname, this.lastname] = name.split(' ');
  }
}
