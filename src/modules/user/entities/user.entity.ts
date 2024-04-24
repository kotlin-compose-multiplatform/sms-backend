import { Sms } from 'src/modules/sms/entities/sm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Full name , Phone number , description , region , zawoda ya-da parniga degislidigi

export enum UserType {
  ZAWOD = 'zawod',
  PARNIK = 'parnik',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  description: string;

  @Column()
  region: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.ZAWOD,
  })
  type: UserType;

  @OneToMany(() => Sms, (sms) => sms.user)
  sms?: Sms[];

  @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
  @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}
