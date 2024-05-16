import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SmsStatus {
  NEW = 'new',
  PENDING = 'PENDING',
  SENT = 'sent',
  ERROR = 'error',
}

export enum Type {
  ZAWOD = 'zawod',
  PARNIK = 'parnik',
}

@Entity()
export class Sms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({
    default: new Date(),
  })
  scheduledDate?: Date;

  @Column()
  phone: string;

  @Column({
    default: false,
  })
  isScheduled: boolean;

  @Column({
    type: 'enum',
    enum: SmsStatus,
    default: SmsStatus.NEW,
  })
  status: SmsStatus;

  @ManyToOne(() => User, (user) => user.sms)
  user?: User;

  @Column()
  userId?: number;

  @Column()
  uuid: string;

  @Column()
  region: string;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.ZAWOD,
  })
  type: Type;

  @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
  @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}
