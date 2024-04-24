import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sms } from '../sms/entities/sm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sms])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
