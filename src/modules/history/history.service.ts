import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sms, Type } from '../sms/entities/sm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(Sms)
    private repo: Repository<Sms>,
  ) {}
  filter(region: string, type: string) {
    let where = {};

    if (region) {
      where = {
        ...where,
        region: region,
      };
    }

    if (type) {
      const t = type == Type.PARNIK ? Type.PARNIK : Type.ZAWOD;
      where = {
        ...where,
        type: t,
      };
    }
    return this.repo.findBy(where);
  }

  async deleteSms(id: number) {
    try {
      const result = await this.repo.delete(id);
      return result;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
