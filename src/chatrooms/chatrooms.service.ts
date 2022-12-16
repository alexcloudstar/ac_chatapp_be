import {
  BadRequestException,
  Injectable,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Chatroom, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateChatroomDto } from './dto/update-room.dto';

@Injectable()
export class ChatroomsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Chatroom[]> {
    return this.prisma.chatroom.findMany({
      include: {
        users: true,
        messages: true,
      },
    });
  }

  find(@Param() chatroomId: number): Promise<Chatroom> {
    return this.prisma.chatroom.findUnique({
      where: { id: chatroomId },
      include: {
        users: true,
        messages: true,
      },
    });
  }

  async create(
    userOwnerId: number,
    userUsernames: string[],
    isPrivate: boolean,
    name: string,
    profanityWords: string[],
    roomAvatar: string,
  ): Promise<Chatroom> {
    const usersId = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              in: userUsernames,
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const usersArrIds: { id: number }[] = usersId?.map((user) => ({
      id: user.id,
    }));

    usersArrIds.push({ id: userOwnerId });

    return this.prisma.chatroom.create({
      data: {
        userOwnerId,
        isPrivate,
        name,
        profanityWords,
        roomAvatar,
        users: {
          connect: usersArrIds,
        },
        messages: {
          create: {
            message: 'Welcome to the chatroom! ⚡️',
            senderId: userOwnerId,
          },
        },
      },
      include: {
        users: true,
      },
    });
  }

  async update(
    roomId: Chatroom['id'],
    body: UpdateChatroomDto,
    user: User,
  ): Promise<Chatroom> {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: roomId },
    });

    if (room.userOwnerId !== user.id)
      throw new UnauthorizedException({
        message: 'You are not the owner of this chatroom',
        error: 'unauthorized',
        statusCode: 401,
      });

    const usersId = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              in: body.users,
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const usersArrIds: { id: number }[] = usersId?.map((user) => ({
      id: user.id,
    }));

    usersArrIds.push({ id: room.userOwnerId });

    return this.prisma.chatroom.update({
      where: { id: roomId },
      data: {
        ...body,
        users: {
          set: usersArrIds,
        },
      },
      include: {
        users: true,
      },
    });
  }

  async delete(chatroomId: number, userId?: number): Promise<Chatroom> {
    try {
      const room = await this.prisma.chatroom.findUnique({
        where: { id: chatroomId },
      });

      if (room.userOwnerId !== userId)
        throw new UnauthorizedException({
          message: 'You are not the owner of this chatroom',
          error: 'unauthorized',
          statusCode: 401,
        });

      return this.prisma.chatroom.delete({ where: { id: chatroomId } });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async join(chatroomId: number, userId: number): Promise<Chatroom> {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: chatroomId },
    });

    if (room.isPrivate)
      throw new BadRequestException('This chatroom is private');

    return this.prisma.chatroom.update({
      where: { id: chatroomId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async invite(chatroomId: number, userId: number): Promise<Chatroom> {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: chatroomId },
    });

    if (room.userOwnerId !== userId)
      throw new BadRequestException('You are not the owner of this chatroom');

    return this.prisma.chatroom.update({
      where: { id: chatroomId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async leave(chatroomId: number, userId: number): Promise<Chatroom> {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: chatroomId },
    });

    if (room.userOwnerId === userId)
      throw new BadRequestException(
        'You are the owner of this chatroom, please delete room',
      );

    return this.prisma.chatroom.update({
      where: { id: chatroomId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });
  }

  async findJoined(userId: number): Promise<Chatroom[]> {
    if (!userId) throw new BadRequestException('Please login');

    return this.prisma.chatroom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });
  }
}
