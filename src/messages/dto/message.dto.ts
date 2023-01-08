import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @Expose()
  id: number;

  @Expose()
  message: string;

  @Expose()
  senderId: number;

  @Expose()
  sender: any;

  @Expose()
  createdAt: Date;

  @Expose()
  chatroomId: number;
}

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  message: string;
}

export class DeleteMessageDto {
  @ApiProperty()
  @IsString()
  messageId: string;
}
