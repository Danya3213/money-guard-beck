import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { isValidTokenGuard } from '../global/guards/isValidToken.guard';
import { ICreatedTransaction } from './interfaces/created-transaction.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {Request} from 'express';

@Controller('trans')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('add')
  @UseGuards(isValidTokenGuard)
  async create(@Req() req: Request, @Body() dto: CreateTransactionDto): Promise<ICreatedTransaction> {
    return this.transactionsService.create(dto, req.cookies?.token);
  }
  @Patch('change/:id')
  @UseGuards(isValidTokenGuard)
  async change(@Param('id') transactionId: string, @Body() dto: CreateTransactionDto, @Req() req: Request) {
    return this.transactionsService.change(transactionId, dto, req.cookies?.token);
  }
  @Delete('del/:id')
  @UseGuards(isValidTokenGuard)
  async delete(@Param('id') transactionId: string, @Req() req: Request) {
    return this.transactionsService.delete(transactionId, req.cookies?.token);
  }

  @Get('categories')
  @UseGuards(isValidTokenGuard)
  getCategories() {
    return this.transactionsService.getTransactionCategories()
  }
}