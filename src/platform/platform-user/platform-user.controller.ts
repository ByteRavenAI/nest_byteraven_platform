import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlatformUserService } from './platform-user.service';
import {
  CreatePlatformUserDto,
  GetJwtForPlatformUserDto,
  GetPlatformUserViaEmailDto,
  GetPlatformUserViaIdDto,
} from './dto/platform-user-dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlatformUserJwtGuard } from '../platform-auth/guard/jwt.guard';

@ApiTags('Platform User')
@Controller('platform/platformUser')
export class PlatformUserController {
  constructor(
    private platformUserService: PlatformUserService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Platform User' })
  async createPlatformUser(@Body() dto: CreatePlatformUserDto) {
    const platformUser = await this.platformUserService.createPlatformUser(dto);
    if (platformUser) return platformUser;
    else throw new HttpException('Failed to create Platform User', 500);
  }

  @Get('get/email')
  @ApiOperation({ summary: 'Get the Platform User by email' })
  async getPlatformUserViaEmail(@Query() query: GetPlatformUserViaEmailDto) {
    const platformUser =
      await this.platformUserService.getPlatformUserViaEmail(query);
    if (platformUser) return platformUser;
    else throw new HttpException('Platform User not found', 404);
  }

  @Get('get/id')
  @UseGuards(PlatformUserJwtGuard)
  @ApiOperation({ summary: 'Get the Platform User by id' })
  async getPlatformUserViaId(@Query() query: GetPlatformUserViaIdDto) {
    const platformUser =
      await this.platformUserService.getPlatformUserViaId(query);
    if (platformUser) return platformUser;
    else throw new HttpException('Platform User not found', 404);
  }

  @Get('getAuthToken')
  @ApiOperation({
    summary: 'Create & Get a signed JWT token for the Platform User',
  })
  async getJwtForPlatformUser(@Query() query: GetJwtForPlatformUserDto) {
    const jwt: string =
      await this.platformUserService.getSignedJwtTokenForUser(query);
    if (jwt) return jwt;
    else throw new HttpException('Failed to create JWT', 500);
  }
}
