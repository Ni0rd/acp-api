import OdooDataSource from './Odoo';
import { User } from '../@types/resolverTypes';

function odooUserReducer(data: Odoo.User): User {
  const name = data.name || '';
  const [firstname, lastname] = name.split(' ');
  return {
    id: data.id,
    email: data.email,
    firstname,
    lastname,
  };
}

export default class OdooUserDataSource<TContext> extends OdooDataSource<
  TContext
> {
  async getUserById(userId: number): Promise<User | null> {
    console.log('ouin ouin');

    const [data] = (await this.odoo.executeReadAsAdmin({
      model: 'res.users',
      ids: [userId],
      fields: ['id', 'name', 'email'],
    })) as {
      id: number;
      name: string;
      email: string;
    }[];
    if (!data) {
      return null;
    }
    return odooUserReducer(data);
  }

  async getUserIdByUsername(username: string): Promise<number> {
    const [userId] = await this.odoo.executeSearchAsAdmin({
      model: 'res.users',
      filters: [['email', '=', username]],
    });
    return userId;
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    await this.odoo.executeKwAsAdmin({
      model: 'res.users',
      method: 'write',
      data: [
        [userId],
        {
          password: newPassword,
        },
      ],
    });
  }
}
