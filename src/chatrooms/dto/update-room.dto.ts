import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatroomDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  profanityWords?: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  users?: string[];
}
