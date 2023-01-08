import { User } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { MessageDto } from '../../messages/dto/message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChatroomDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Transform(({ obj }) =>
    obj.messages?.map((message: MessageDto) => ({
      id: message.id,
      message: message.message,
      senderId: message.senderId,
      createdAt: message.createdAt,
      sender: obj.users.reduce((acc: any, user: User) => {
        if (user.id === message.senderId) {
          acc = user;
        }
        return {
          username: acc.username,
          avatar: acc.avatar,
        };
      }, {}),
    })),
  )
  @Expose()
  messages: MessageDto[];

  @ApiProperty()
  @Transform(({ obj }: { obj: { users: User[] } }) =>
    obj.users?.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    })),
  )
  @Expose()
  users: { id: number }[];

  @ApiProperty()
  @Expose()
  userOwnerId: number;

  @ApiProperty()
  @Expose()
  isPrivate: boolean;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  profanityWords: string[];

  @ApiProperty()
  @Expose()
  roomAvatar: string;
}
