import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection, SubscribeMessage, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TransactionsService } from './transactions.service';
import * as cookie from "cookie";
import { ICreatedTransaction } from './interfaces/created-transaction.interface';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/api/trans',
})
export class TransactionsGateway implements OnGatewayConnection {

  transactions: Omit<ICreatedTransaction, "userId">[];
  clientCookies: string | undefined;
  parsedCookies: {
    token: string;
  } | undefined;
  client: Socket | undefined;

  // constructor(private readonly transactionsService: TransactionsService) {
  constructor(
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {
    this.transactions = [];
    this.clientCookies = "";
    this.parsedCookies = {
      token: "",
    }
    this.client = undefined
  }

  @WebSocketServer() server: Server;

  async updateTransactions(): Promise<void> {

    if (!this.parsedCookies?.token) {
      this.transactions = [];
      return;
    }

    this.transactions = await this.transactionsService.getAll(this.parsedCookies.token);
    this.client?.emit("transactions", this.transactions);
  }

  updateClientCookies(): void {

    if (!this.clientCookies) {
      this.parsedCookies = {
        token: "",
      };
      return;
    }

    this.parsedCookies = cookie.parse(this.clientCookies);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {

    this.client = client;
    this.clientCookies = client.handshake.headers.cookie;

    this.updateClientCookies();
    await this.updateTransactions();
  }

  @SubscribeMessage("message")
  async handleMessage(@MessageBody() message: string | object, @ConnectedSocket() client: Socket) {

    if (message === "check new transactions") {

      await this.updateTransactions();
    }
  }
}
