import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformUserDto,
  GetPlatformUserViaEmailDto,
  GetPlatformUserViaIdDto,
} from './dto/platform-user-dto';

@Injectable()
export class PlatformUserService {
  constructor(private prisma: PrismaService) {}

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
}
