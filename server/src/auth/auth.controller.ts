import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Session,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from '../utils/jwt/local-auth.guard';
import { UsersService } from '../users/users.service';

import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/signup')
  signup(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<{
    accessToken: string;
  }> {
    return this.authService.signup(body.email, body.username, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signin(@Request() req) {
    return this.authService.signin(req.user);
  }

  @Post('/signout/:id')
  signOut(@Param('id') id: any): Promise<{ message: string }> {
    return this.authService.signout(id);
  }
}
