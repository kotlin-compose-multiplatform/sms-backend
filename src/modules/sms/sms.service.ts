import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSmDto } from './dto/create-sm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sms, SmsStatus, Type } from './entities/sm.entity';
import { Repository } from 'typeorm';
import { User, UserType } from '../user/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { AppResponse } from 'src/core/app.types';
import axios from 'axios';

@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(Sms)
    private repo: Repository<Sms>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async create(createSmDto: CreateSmDto): Promise<AppResponse> {
    const smsUrl = process.env.SMS_URL;
    const ids = createSmDto.ids;
    const uid: string = uuid();
    if (ids && ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        const user = await this.userRepo.findOneBy({ id: ids[i] });
        let status = SmsStatus.NEW;
        if (!createSmDto.isScheduled && createSmDto.isScheduled == false) {
          try {
            const res = await axios.post(`${smsUrl}/send-code`, {
              code: createSmDto.message,
              phoneNumber: user.phone,
            });
            if (res.data == 'success') {
              status = SmsStatus.SENT;
            } else {
              status = SmsStatus.ERROR;
            }
          } catch (err) {
            console.error(err);
            status = SmsStatus.ERROR;
          }
        }
        await this.repo.insert({
          isScheduled: createSmDto.isScheduled
            ? createSmDto.isScheduled
            : false,
          userId: ids[i],
          message: createSmDto.message,
          scheduledDate: createSmDto.scheduledDate
            ? createSmDto.scheduledDate
            : new Date(),
          phone: user.phone,
          uuid: uid,
          status: status,
          region: user.region,
          type: user.type == UserType.PARNIK ? Type.PARNIK : Type.ZAWOD,
        });
      }
      return {
        error: false,
        message: 'Sent successfully',
        data: null,
      };
    } else {
      throw new BadRequestException('IDS are empty');
    }
  }
}
