import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { ICreatedTransaction } from './interfaces/created-transaction.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtService } from '@nestjs/jwt';
import { IDecodedUser } from '../auth/interfaces/user.interface';
import { ECategories } from './enums/categories.enum';
import { TransactionsGateway } from './transactions.gateway';

@Injectable()
export class TransactionsService {

  // constructor(@InjectModel("transaction") private readonly transactionsModel: Model<Transaction>, private readonly jwtService: JwtService, private readonly transactionsGateway: TransactionsGateway) {
  // }
  constructor(
    @Inject(forwardRef(() => TransactionsGateway))
    private readonly transactionsGateway: TransactionsGateway,
    @InjectModel("transaction") private readonly transactionsModel: Model<Transaction>,
    private readonly jwtService: JwtService,
  ) {}

  jwtDecode(token: string): IDecodedUser {
    return this.jwtService.decode(token)
  }

  async getAll(token: string): Promise<Omit<ICreatedTransaction, "userId">[]> {

    const user = this.jwtDecode(token);
    const transactions: ICreatedTransaction[] = await this.transactionsModel.find({userId: user._id}).lean();

    return transactions.map((t) => {

      const {userId, ...data} = t;
      return data;
    })
  }

  async create(dto: CreateTransactionDto, token: string): Promise<ICreatedTransaction> {

    const user: IDecodedUser = this.jwtDecode(token);

    if (!user) throw new UnauthorizedException();

    const transaction = new this.transactionsModel({
      ...dto,
      userId: user._id,
    });

    const newTransaction = await transaction.save();

    if (!newTransaction) throw new NotFoundException("Transaction wasn't created, please try again later");

    await this.transactionsGateway.updateTransactions();

    return newTransaction;
  }

  async delete(transactionId: unknown, token:string) {

    const user: IDecodedUser = this.jwtDecode(token);
    const transaction = await this.transactionsModel.findOneAndDelete({userId: user._id, _id: transactionId});

    if (!transaction) throw new NotFoundException("Transaction does not exist or you haven't permission to delete it");

    await this.transactionsGateway.updateTransactions();

    return transaction;
  }

  async change(transactionId: unknown, dto: Partial<CreateTransactionDto>, token: string): Promise<ICreatedTransaction> {

    const user: IDecodedUser = this.jwtDecode(token);
    let transaction: ICreatedTransaction | null;

    try {

      transaction = await this.transactionsModel.findOneAndUpdate(
        { _id: transactionId, userId: user._id },
        dto,
        { new: true }
      )

    }  catch (error)  {
      throw new BadRequestException("Invalid transaction id");
    }

    if (!transaction) throw new NotFoundException("Transaction does not exist or you haven't permission to change it");

    await this.transactionsGateway.updateTransactions();
    return transaction;
  }

  getTransactionCategories(): string[] {
    return Object.values<string>(ECategories)
  }
}