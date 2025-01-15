import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlatformUserService } from './platform-user.service';
import {
  CreatePlatformUserDto,
  GetJwtForPlatformUserDto,
  GetPlatformUserViaEmailDto,
  GetPlatformUserViaIdDto,
} from './dto/platform-user-dto';

@Controller('platform/platformUser')
export class PlatformUserController {
  constructor(private platformUserService: PlatformUserService) {}

  @Post()
  async createPlatformUser(@Body() dto: CreatePlatformUserDto) {
    return this.platformUserService.createPlatformUser(dto);
  }

  @Get('get/email')
  async getPlatformUserViaEmail(@Query() query: GetPlatformUserViaEmailDto) {
    return this.platformUserService.getPlatformUserViaEmail(query);
  }

  @Get('get/id')
  async getPlatformUserViaId(@Query() query: GetPlatformUserViaIdDto) {
    return this.platformUserService.getPlatformUserViaId(query);
  }

  @Get('getAuthToken')
  async getJwtForPlatformUser(@Query() query: GetJwtForPlatformUserDto) {
    return this.platformUserService.getSignedJwtTokenForUser(query);
  }
}
