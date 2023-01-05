import { Chatroom, PunishmentType, User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreatePunishDto {
  @IsNumber()
  chatroomId: Chatroom['id'];

  @IsNumber()
  userId: User['id'];

  @IsString()
  reason: string;

  @IsString()
  type: PunishmentType;

  @IsNumber()
  duration: number;
}

export class UnpunishDto {
  @IsNumber()
  chatroomId: Chatroom['id'];

  @IsNumber()
  userId: User['id'];

  @IsNumber()
  punishmentId: number;
}
