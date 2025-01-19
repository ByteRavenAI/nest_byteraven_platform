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
      return this.prisma.platformUser.create({
        data: dto,
      });
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
  ): Promise<PlatformUserResponseDto> {
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
      this.logger.error(
        `Unable to find platform user: ${error}`,
        error.stack,
        'PlatformUserService/getPlatformUserViaEmail',
      );
      throw new Error('Unable to find user');
    }
  }

  async getPlatformUserViaId(
    query: GetPlatformUserViaIdDto,
  ): Promise<PlatformUserResponseDto> {
    try {
      const user = await this.prisma.platformUser.findUnique({
        where: { id: query.platformUserId },
      });

      if (!user) {
        this.logger.error(
          `No platform user found with the provided id: ${query.platformUserId}`,
          'PlatformUserService/getPlatformUserViaId',
        );
        throw new NotFoundException(
          'No platform user found with the provided id',
        );
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Unable to find platform user: ${error}`,
        error.stack,
        'PlatformUserService/getPlatformUserViaId',
      );
      throw new Error('Unable to find user');
    }
  }

  async getSignedJwtTokenForUser(
    query: GetJwtForPlatformUserDto,
  ): Promise<string> {
    try {
      // check in the database if the user exists
      const user = await this.prisma.platformUser.findUnique({
        where: { id: query.platformUserId, email: query.email },
      });
      if (!user) {
        this.logger.error(
          `No user found with the provided id: ${query.platformUserId} and email: ${query.email}`,
          'PlatformUserService/getSignedJwtTokenForUser',
        );
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
      this.logger.error(
        `Unable to create JWT: ${error}`,
        error.stack,
        'PlatformUserService/getSignedJwtTokenForUser',
      );
      throw new Error('Unable to find user');
    }
  }
}
