import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Chatroom, User } from '@prisma/client';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ChatroomsService } from './chatrooms.service';
import { ChatroomDto } from './dto/chatroom.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { JwtAuthGuard } from '../utils/jwt/jwt-auth.guard';
import { UpdateChatroomDto } from './dto/update-room.dto';

@Serialize(ChatroomDto)
@UseGuards(JwtAuthGuard)
@Controller('chatrooms')
export class ChatroomsController {
  constructor(private chatroomsService: ChatroomsService) {}

  @Get('/joined')
  findJoined(@CurrentUser() user: User): Promise<Chatroom[]> {
    return this.chatroomsService.findJoined(+user?.id);
  }

  @Get()
  findAll(): Promise<Chatroom[]> {
    return this.chatroomsService.findAll();
  }

  @Get('/:id')
  find(@Param('id') id: string): Promise<Chatroom> {
    return this.chatroomsService.find(+id);
  }

  @Post()
  create(
    @Body() body: CreateChatroomDto,
    @CurrentUser() user: User,
  ): Promise<Chatroom> {
    return this.chatroomsService.create(
      user?.id,
      body.userUsernames,
      body.isPrivate,
      body.name,
      body.profanityWords,
      body.roomAvatar,
    );
  }

  @Post('/:id/join')
  join(@Param('id') id: string, @Body() body: any): Promise<Chatroom> {
    return this.chatroomsService.join(+id, +body.userId);
  }

  @Post('/:id/invite')
  invite(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<Chatroom> {
    return this.chatroomsService.invite(+id, +body.userId);
  }

  @Post('/:id/leave')
  leave(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<Chatroom> {
    return this.chatroomsService.leave(+id, +body.userId);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateChatroomDto,
    @CurrentUser() user: User,
  ): Promise<Chatroom> {
    return this.chatroomsService.update(+id, body, user);
  }

  @Delete('/:id')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Chatroom> {
    return this.chatroomsService.delete(+id, user?.id);
  }
}
