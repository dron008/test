export enum Role {
  Admin = 'admin',
  Customer = 'customer',
}

type User = {
  id: string;
  name: string;
  password: string;
  role: Role;
};

export class IAuthenticate {
  readonly user: User;
  readonly token: string;
}
