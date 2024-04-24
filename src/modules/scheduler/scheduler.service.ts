import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scheduler } from './entities/scheduler.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Scheduler)
    private repo: Repository<Scheduler>,
  ) {}
  async remove(id: number) {
    try {
      const result = await this.repo.delete(id);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  async update(id: number, dto: UpdateSchedulerDto) {
    try {
      const result = await this.repo.update(id, dto);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  findAll() {
    return this.repo.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
  async create(dto: CreateSchedulerDto) {
    try {
      await this.repo.insert(dto);
      return {
        error: false,
        message: 'Created successfully',
        data: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
