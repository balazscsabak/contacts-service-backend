import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from 'src/common/helper/password.helper';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.findByEmail(createUserDto.email);

    if (emailExists) {
      throw new ConflictException('User with this email already exists');
    }

    return await new this.userModel({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    }).save();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    let user;

    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException(`Product with ID: ${id} does not exist.`);
    }

    if (!user) {
      throw new NotFoundException(`Product with ID: ${id} does not exist.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user;

    try {
      user = await this.userModel.findOneAndReplace(
        { _id: id },
        {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new NotFoundException(`Product with ID: ${id} does not exist.`);
    }

    if (!user) {
      throw new NotFoundException(`Product with ID: ${id} does not exist.`);
    }

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).select('+password').exec();
  }
}
