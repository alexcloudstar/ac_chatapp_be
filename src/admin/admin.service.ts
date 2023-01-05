import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Chatroom, Punishment, PunishmentType, User } from '@prisma/client';
import { fiveMinutesPassed } from '../utils/minutesPassed';

// TODO: Implement punishment expiration

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.user.findMany({
      where: {
        isAdmin: true,
      },
    });
  }

  async toggleAdmin(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        isAdmin: !user.isAdmin,
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
      },
    });
  }

  async punishUser(
    chatroomId: Chatroom['id'],
    currentUser: User,
    userId: User['id'],
    reason: string,
    type: PunishmentType,
    duration: number,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.prismaService.punishment.create({
      data: {
        chatroomId,
        userId,
        reason,
        type,
        duration,
        givenBy: currentUser.username,
      },
    });
  }

  async unpunishUser(punishmentId: Punishment['id']) {
    try {
      await this.prismaService.punishment.delete({
        where: {
          id: +punishmentId,
        },
      });

      return 'Punishment removed successfully';
    } catch (err: any) {
      throw new BadRequestException(err);
    }
  }

  async checkPunishments(userId: Punishment['userId']) {
    try {
      const userPunishments = await this.prismaService.punishment.findMany({
        where: {
          userId: +userId,
        },
      });

      for (const punishment of userPunishments) {
        if (
          fiveMinutesPassed(
            new Date(),
            punishment.createdAt,
            punishment.duration,
          )
        ) {
          const deletedPunishment = await this.prismaService.punishment.delete({
            where: {
              id: punishment.id,
            },
          });

          return {
            deletedPunishment: {
              message: 'Punishment removed successfully',
              deletedPunishment: deletedPunishment.id,
            },
          };
        }
      }

      return {
        message: 'No punishments to delete found',
      };
    } catch (err: any) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
