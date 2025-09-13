import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Transaction extends Document {

  @Prop({ required: true })
  date: string;
  @Prop({ required: true })
  type: boolean;
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  comment: string;
  @Prop({ required: true })
  sum: number;
  @Prop({ required: true, type: String })
  userId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);