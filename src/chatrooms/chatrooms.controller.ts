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
@Controller('chatrooms')
export class ChatroomsController {
  constructor(private chatroomsService: ChatroomsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/joined')
  findJoined(@CurrentUser() user: User): Promise<Chatroom[]> {
    return this.chatroomsService.findJoined(+user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Chatroom[]> {
    return this.chatroomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  find(@Param('id') id: string): Promise<Chatroom> {
    return this.chatroomsService.find(+id);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('/:id/join')
  join(@Param('id') id: string, @Body() body: any): Promise<Chatroom> {
    return this.chatroomsService.join(+id, +body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/invite')
  invite(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<Chatroom> {
    return this.chatroomsService.invite(+id, +body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/leave')
  leave(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<Chatroom> {
    return this.chatroomsService.leave(+id, +body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateChatroomDto,
    @CurrentUser() user: User,
  ): Promise<Chatroom> {
    return this.chatroomsService.update(+id, body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Chatroom> {
    return this.chatroomsService.delete(+id, user?.id);
  }
}
