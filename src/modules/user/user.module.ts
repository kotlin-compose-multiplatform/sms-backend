import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { elasticsearchProviders } from 'src/core/elastic.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ...elasticsearchProviders],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
