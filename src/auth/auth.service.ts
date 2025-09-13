import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { IUser, IReturnedUser, IDecodedUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CheckUserDto } from './dto/check-user.dto';
import { JwtService, JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {
  }

  async checkPassword(user: CheckUserDto | IDecodedUser, alreadyFoundedUser?: IUser): Promise<boolean> {

    if (alreadyFoundedUser) {

      return bcrypt.compare(user.password, alreadyFoundedUser.password);

    } else {

      const foundedUser = await this.findUser({email : user.email});

      if (!foundedUser) return false;

      return bcrypt.compare(user.password, foundedUser.password);
    }
  }

  async findUser(prop: object): Promise<IUser | null> {

    return this.userModel.findOne(prop).lean();
  }

  async registration(dto: CreateUserDto): Promise<IReturnedUser> {

    const foundedUserByEmail: IUser | null = await this.findUser({ email: dto.email });
    const foundedUserByName: IUser | null = await this.findUser({ username: dto.username.toLowerCase() });

    if (foundedUserByEmail) throw new ConflictException('User with this email already exists');
    if (foundedUserByName) throw new ConflictException('User with this name already exists');

    const hash: string = await bcrypt.hash(dto.password, 10);
    const createdToken = this.jwtService.sign(dto);

    const user = {
      ...dto,
      password: hash,
      token: createdToken,
    };

    const createdUser: IUser & Document = new this.userModel(user);
    const savedUser: IUser & Document = await createdUser.save();

    const { username, email, token }: IReturnedUser = savedUser.toObject();

    return {
      username,
      email,
      password: dto.password,
      token,
    };
  };

  async login(dto: CheckUserDto): Promise<IReturnedUser | null> {

    const foundedUser: IUser | null = await this.findUser({ email: dto.email });

    if (!foundedUser) throw new ConflictException(`Incorrect email or password`);

    const checkPassword = await this.checkPassword(dto, foundedUser);

    if (!foundedUser || !checkPassword) throw new NotFoundException('Incorrect email or password');

    const { username, email, password, _id}: {
      username: string;
      email: string;
      password: string;
      _id: unknown;
    } = foundedUser;

    const token = this.jwtService.sign({username, email, password, _id});

    return {
      username,
      email,
      password: dto.password,
      token,
    };
  };

  async checkToken(token: string): Promise<string> {

    const user = this.jwtService.decode(token);
    return user.username;
  }
}
