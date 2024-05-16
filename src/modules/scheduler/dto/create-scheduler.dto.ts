import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchedulerDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  text: string;
  @IsNotEmpty()
  reminderDate: Date;
}
