import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlatformUserService } from './platform-user.service';
import {
  CreatePlatformUserDto,
  GetJwtForPlatformUserDto,
  GetPlatformUserViaEmailDto,
  GetPlatformUserViaIdDto,
} from './dto/platform-user-dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Platform User')
@Controller('platform/platformUser')
export class PlatformUserController {
  constructor(private platformUserService: PlatformUserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Platform User' })
  async createPlatformUser(@Body() dto: CreatePlatformUserDto) {
    return this.platformUserService.createPlatformUser(dto);
  }

  @Get('get/email')
  @ApiOperation({ summary: 'Get the Platform User by email' })
  async getPlatformUserViaEmail(@Query() query: GetPlatformUserViaEmailDto) {
    return this.platformUserService.getPlatformUserViaEmail(query);
  }

  @Get('get/id')
  @ApiOperation({ summary: 'Get the Platform User by id' })
  async getPlatformUserViaId(@Query() query: GetPlatformUserViaIdDto) {
    return this.platformUserService.getPlatformUserViaId(query);
  }

  @Get('getAuthToken')
  @ApiOperation({
    summary: 'Create & Get a signed JWT token for the Platform User',
  })
  async getJwtForPlatformUser(@Query() query: GetJwtForPlatformUserDto) {
    return this.platformUserService.getSignedJwtTokenForUser(query);
  }
}
