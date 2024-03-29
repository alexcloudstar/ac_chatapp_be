import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AvatarGenerator } from 'random-avatar-generator';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signup(
    email: User['email'],
    username: User['username'],
    password: User['password'],
  ): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const generator = new AvatarGenerator();

    if (user)
      throw new BadRequestException({
        message: 'User already exists',
        statusCode: 400,
        error: 'user_already_exists',
      });

    const hash = await argon2.hash(password);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hash,
        avatar: generator.generateRandomAvatar(),
      },
    });

    const payload = {
      email: newUser.email,
      username: newUser.username,
      sub: newUser.id,
    };

    await this.usersService.updateIsOnlineStatus(newUser.id, true);

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }),
    };
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new BadRequestException({
        message: 'User does not exist',
        statusCode: 400,
        error: 'user_does_not_exist',
      });

    const valid = await argon2.verify(user.password, password);

    if (valid) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException({
      message: 'Invalid credentials',
      error: 'invalid_credentials',
      statusCode: 401,
    });
  }

  async signin(user: Omit<User, 'password'>): Promise<{ accessToken: string }> {
    const payload = {
      email: user.email,
      username: user.username,
      sub: user.id,
    };

    try {
      await this.usersService.updateIsOnlineStatus(user.id, true);

      return {
        accessToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN,
        }),
      };
    } catch (e) {
      console.log(e);
    }
  }

  async signout(id: User['id']): Promise<{ message: string }> {
    await this.usersService.updateIsOnlineStatus(id, false);

    return {
      message: 'Signed out',
    };
  }
}
