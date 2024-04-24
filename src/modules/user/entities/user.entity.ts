import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
