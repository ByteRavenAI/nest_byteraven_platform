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
  PlatformUserJwtResponseDto,
  PlatformUserResponseDto,
} from './dto/platform-user-dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
  @ApiResponse({
    status: 201,
    description: 'Platform User created successfully',
    type: PlatformUserResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Failed to create Platform User' })
  async createPlatformUser(
    @Body() dto: CreatePlatformUserDto,
  ): Promise<PlatformUserResponseDto> {
    const platformUser = await this.platformUserService.createPlatformUser(dto);
    if (platformUser) return platformUser;
    else throw new HttpException('Failed to create Platform User', 500);
  }

  @Get('get/email')
  @ApiResponse({
    status: 200,
    description: 'Platform User found',
    type: PlatformUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Platform User not found' })
  @ApiOperation({ summary: 'Get the Platform User by email' })
  async getPlatformUserViaEmail(
    @Query() query: GetPlatformUserViaEmailDto,
  ): Promise<PlatformUserResponseDto> {
    const platformUser =
      await this.platformUserService.getPlatformUserViaEmail(query);
    if (platformUser) return platformUser;
    else throw new HttpException('Platform User not found', 404);
  }

  @Get('get/id')
  @UseGuards(PlatformUserJwtGuard)
  @ApiOperation({ summary: 'Get the Platform User by id' })
  @ApiResponse({
    status: 200,
    description: 'Platform User found',
    type: PlatformUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Platform User not found' })
  @ApiBearerAuth()
  async getPlatformUserViaId(
    @Query() query: GetPlatformUserViaIdDto,
  ): Promise<PlatformUserResponseDto> {
    const platformUser =
      await this.platformUserService.getPlatformUserViaId(query);
    if (platformUser) return platformUser;
    else throw new HttpException('Platform User not found', 404);
  }

  @Get('getAuthToken')
  @ApiOperation({
    summary: 'Create & Get a signed JWT token for the Platform User',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token created',
    type: PlatformUserJwtResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Failed to create JWT token' })
  async getJwtForPlatformUser(
    @Query() query: GetJwtForPlatformUserDto,
  ): Promise<PlatformUserJwtResponseDto> {
    const jwt: string =
      await this.platformUserService.getSignedJwtTokenForUser(query);
    if (jwt) return { jwt };
    else throw new HttpException('Failed to create JWT', 500);
  }
}
