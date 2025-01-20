import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformUserDto,
  GetJwtForPlatformUserDto,
  GetPlatformUserViaEmailDto,
  GetPlatformUserViaIdDto,
  PlatformUserResponseDto,
} from './dto/platform-user-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { platform } from 'os';

@Injectable()
export class PlatformUserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {}

  async createPlatformUser(
    dto: CreatePlatformUserDto,
  ): Promise<PlatformUserResponseDto> {
    try {
      const response = await this.prisma.platformUser.create({
        data: dto,
      });

      response['platformUserId'] = response['id'];

      return response;
    } catch (error) {
      this.logger.error(
        `Unable to create platform user: ${error}`,
        error.stack,
        'PlatformUserService/createPlatformUser',
      );
      throw new Error('Unable to create user');
    }
  }

  async getPlatformUserViaEmail(
    query: GetPlatformUserViaEmailDto,
  ): Promise<PlatformUserResponseDto | null> {
    try {
      const user = await this.prisma.platformUser.findUnique({
        where: { email: query.email },
      });

      if (!user) {
        return null;
      }

      user['platformUserId'] = user['id'];

      return user;
    } catch (error) {
      this.logger.error(
        `Unable to find platform user: ${error}`,

        'PlatformUserService/getPlatformUserViaEmail',
      );
      return null;
    }
  }

  async getPlatformUserViaId(
    query: GetPlatformUserViaIdDto,
  ): Promise<PlatformUserResponseDto | null> {
    try {

      console.log(query.platformUserId);
      const user = await this.prisma.platformUser.findUnique({
        where: { id: query.platformUserId },
      });

      if (!user) {
        return null;
      }

      user['platformUserId'] = user['id'];

      return user;
    } catch (error) {
      // this.logger.error(
      //   `Unable to find platform user: ${error}`,
      //   error.stack,
      //   'PlatformUserService/getPlatformUserViaId',
      // );
      throw new Error('Unable to find user');
    }
  }

  async getSignedJwtTokenForUser(
    query: GetJwtForPlatformUserDto,
  ): Promise<string | null> {
    try {
      // check in the database if the user exists
      const user = await this.prisma.platformUser.findUnique({
        where: { id: query.platformUserId, email: query.email },
      });
      if (!user) {
        // this.logger.error(
        //   `No user found with the provided id: ${query.platformUserId} and email: ${query.email}`,
        //   'PlatformUserService/getSignedJwtTokenForUser',
        // );
        return null;
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
      this.logger.error(
        `Unable to create JWT: ${error}`,
        error.stack,
        'PlatformUserService/getSignedJwtTokenForUser',
      );
      return null;
    }
  }
}
