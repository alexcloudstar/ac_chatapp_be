import { Message, Punishment } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  username: string;
  @ApiProperty()
  @Expose()
  avatar: string;
  @ApiProperty()
  @Expose()
  messages: Message[];
  @ApiProperty()
  @Expose()
  admin: boolean;
  @ApiProperty()
  @Expose()
  @IsDate()
  createdAt: string;
  @ApiProperty()
  @Expose()
  punishments: Punishment[];
  @ApiProperty()
  @Expose()
  accessToken: string;
  @ApiProperty()
  @Expose()
  isOnline: boolean;
  @ApiProperty()
  @Expose()
  isAdmin: boolean;
}
