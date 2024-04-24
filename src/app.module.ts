import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { HistoryModule } from './modules/history/history.module';
import { SmsModule } from './modules/sms/sms.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { User } from './modules/user/entities/user.entity';
import { Sms } from './modules/sms/entities/sm.entity';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Scheduler } from './modules/scheduler/entities/scheduler.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'QwertyWeb123',
      database: 'sms',
      entities: [User, Sms, Scheduler],
      synchronize: true,
    }),
    UserModule,
    HistoryModule,
    SmsModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
