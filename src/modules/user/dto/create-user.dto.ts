import { UserType } from '../entities/user.entity';

export class CreateUserDto {
  fullName: string;
  phone: string;
  description: string;
  region: string;
  type: UserType;
}
