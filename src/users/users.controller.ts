import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';

import { UpdateUserDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../utils/jwt/jwt-auth.guard';

@Serialize(UserDto)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/whoami')
  whoami(@CurrentUser() user: User) {
    if (!user) throw new NotFoundException(`You are not logged in`);

    return user;
  }

  @Get()
  findAll(@CurrentUser() user: User): Promise<User[]> {
    return this.usersService.findAll(user.id);
  }

  @Get('/:username')
  async findOne(
    @Param('username') username: string,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.usersService.find(username);
    } catch (error) {
      throw new NotFoundException(`User not found with given id: ${username}`);
    }
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.remove(parseInt(id), user);
  }

  @Patch('update-user/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(parseInt(id), body, user);
  }

  @Patch('/update-online-status/:id')
  updateIsOnlineStatus(
    @Param('id') id: User['id'],
    @Body() body: { isOnline: boolean },
  ) {
    return this.usersService.updateIsOnlineStatus(+id, body.isOnline);
  }
}
