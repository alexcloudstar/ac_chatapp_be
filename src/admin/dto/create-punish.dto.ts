import { Chatroom, PunishmentType, User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePunishDto {
  @ApiProperty()
  @IsNumber()
  chatroomId: Chatroom['id'];

  @ApiProperty()
  @IsNumber()
  userId: User['id'];

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  type: PunishmentType;

  @ApiProperty()
  @IsNumber()
  duration: number;
}
