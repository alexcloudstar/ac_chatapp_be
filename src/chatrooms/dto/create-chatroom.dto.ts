import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatroomDto {
  @ApiProperty()
  @IsString({ each: true })
  userUsernames: string[];

  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString({ each: true })
  profanityWords: string[];

  @ApiProperty()
  @IsString()
  roomAvatar: string;
}
