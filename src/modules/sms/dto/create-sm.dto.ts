import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateSmDto {
  @IsString()
  @IsNotEmpty()
  message: string;
  scheduledDate?: Date;
  isScheduled: boolean;
  @IsArray()
  @IsNotEmpty()
  ids: number[];
}
