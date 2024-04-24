import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { HistoryModule } from './modules/history/history.module';
import { SmsModule } from './modules/sms/sms.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { User } from './modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'QwertyWeb123',
      database: 'sms',
      entities: [User],
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
