import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {

  @IsString({
    message: 'Username must be a string',
  })
  @Length(4, 20, { message: 'Username must be 4-20 characters' })
  username: string;
  @IsEmail({}, {
    message: 'Email must be valid',
  })
  email: string;
  @IsString({
    message: 'Password must be a string',
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 0,
    minSymbols: 0,
  }, {
    message: 'Password must contain at least 1 number and at least 8 characters',
  })
  password: string;
}