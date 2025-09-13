import { ITransaction } from './transaction.interface';

export interface ICreatedTransaction extends ITransaction {
  _id: unknown;
}