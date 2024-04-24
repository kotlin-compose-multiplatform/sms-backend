import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserType } from './entities/user.entity';
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

  filter(region: string, type: string) {
    let where = {};

    if (region) {
      where = {
        ...where,
        region: region,
      };
    }

    if (type) {
      const t = type == UserType.PARNIK ? UserType.PARNIK : UserType.ZAWOD;
      where = {
        ...where,
        type: t,
      };
    }
    return this.usersRepository.findBy(where);
  }
}
