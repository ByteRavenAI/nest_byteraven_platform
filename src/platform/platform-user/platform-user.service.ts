import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformUserDto,
  GetJwtForPlatformUserDto,
  GetPlatformUserViaEmailDto,
  GetPlatformUserViaIdDto,
} from './dto/platform-user-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlatformUserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async createPlatformUser(dto: CreatePlatformUserDto) {
    try {
      return this.prisma.platformUser.create({
        data: dto,
      });
    } catch (error) {
      throw new Error('Unable to create user');
    }
  }

  async getPlatformUserViaEmail(query: GetPlatformUserViaEmailDto) {
    try {
      const user = await this.prisma.platformUser.findUnique({
        where: { email: query.email },
      });

      if (!user) {
        throw new NotFoundException(
          'No platform user found with the provided email',
        );
      }

      return user;
    } catch (error) {
      throw new Error('Unable to find user');
    }
  }

  async getPlatformUserViaId(query: GetPlatformUserViaIdDto) {
    try {
      const user = await this.prisma.platformUser.findUnique({
        where: { id: query.platformUserId },
      });

      if (!user) {
        throw new NotFoundException(
          'No platform user found with the provided id',
        );
      }

      return user;
    } catch (error) {
      throw new Error('Unable to find user');
    }
  }

  async getSignedJwtTokenForUser(query: GetJwtForPlatformUserDto) {
    try {
      // check in the database if the user exists
      const user = await this.prisma.platformUser.findUnique({
        where: { id: query.platformUserId, email: query.email },
      });
      if (!user) {
        throw new NotFoundException(
          'No user found with the provided id and email',
        );
      }
      const payload = {
        sub: query.platformUserId,
        email: query.email,
      };

      const jwt = this.jwt.sign(payload, {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      });

      return jwt;
    } catch (error) {
      throw new Error('Unable to find user');
    }
  }
}
