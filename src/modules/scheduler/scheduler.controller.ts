import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}
  @Post()
  create(@Body() dto: CreateSchedulerDto) {
    return this.schedulerService.create(dto);
  }

  @Get()
  findAll() {
    return this.schedulerService.findAll();
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSchedulerDto) {
    return this.schedulerService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulerService.remove(+id);
  }
}
