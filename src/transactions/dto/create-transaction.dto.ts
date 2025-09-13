import { IsBoolean, IsDateString, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  date: string;

  @IsBoolean({ message: 'Type must be a boolean' })
  type: boolean;

  @IsString({ message: 'Category must be a string' })
  @MinLength(2, { message: 'Category length must be at least 2' })
  category: string;

  @IsString({ message: 'Comment must be a string' })
  @MinLength(2, { message: 'Comment length must be at least 2' })
  comment: string;

  @IsNumber({}, { message: 'Sum must be a number' })
  sum: number;
}
