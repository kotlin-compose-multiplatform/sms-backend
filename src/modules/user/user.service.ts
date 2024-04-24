import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AppResponse } from 'src/core/app.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<AppResponse> {
    try {
      await this.usersRepository.insert(createUserDto);
      return {
        error: false,
        message: 'Created successfully',
        data: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersRepository.update(id, updateUserDto);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.usersRepository.delete(id);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
