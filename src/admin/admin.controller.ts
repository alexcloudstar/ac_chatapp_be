import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreatePunishDto } from './dto/create-punish.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtAuthGuard } from '../utils/jwt/jwt-auth.guard';
import { Punishment } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Post('make-admin')
  makeAdmin(@Body('email') email: string) {
    return this.adminService.toggleAdmin(email);
  }

  @Post('punish')
  punishUser(@Body() body: CreatePunishDto, @CurrentUser() currentUser) {
    return this.adminService.punishUser(
      +body.chatroomId,
      currentUser,
      +body.userId,
      body.reason,
      body.type,
      body.duration,
    );
  }

  @Delete('/:punishmentId')
  unpunishUser(@Param('punishmentId') punishmentId: Punishment['id']) {
    return this.adminService.unpunishUser(punishmentId);
  }

  @Delete('checkPunishments/:userId')
  checkPunishments(@Param('userId') userId: Punishment['userId']) {
    return this.adminService.checkPunishments(userId);
  }
}
