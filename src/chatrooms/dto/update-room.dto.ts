import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChatroomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsString({ each: true })
  @IsOptional()
  profanityWords?: string[];

  @IsString({ each: true })
  @IsOptional()
  userUsernames: string[];
}
