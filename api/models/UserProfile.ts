export default class UserProfile {
  firstname: string;
  lastname: string;
  email: string;

  constructor(data: { firstname: string; lastname: string; email: string }) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
  }
}
