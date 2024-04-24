import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduler } from './entities/scheduler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduler])],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
