export interface IUser {

  username: string;
  password: string;
  email: string;
  token: string;
  isConfirmed: boolean;
  isAdmin: boolean;
  _id: unknown;
}

export interface IReturnedUser {

  username: string;
  email: string;
  password: string;
  isConfirmed: boolean;
  token: string;
}

export interface IDecodedUser extends Omit<IReturnedUser, "token"> {

  _id: unknown;
  iat?: number;
  exp?: number;
}