import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Query,
  UseFilters,
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
  ApiBearerAuth

} from '@nestjs/swagger';
import { PlatformUserJwtGuard } from '../platform-auth/guard/jwt.guard';
import { HttpExceptionFilter } from 'src/helpers/http-exception-filter';
import { ApiResponseWrapper } from 'src/helpers/http-response-wrapper';

@ApiTags('Platform User')
@Controller('platform/platformUser')
@UseFilters(HttpExceptionFilter)
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
  ): Promise<ApiResponseWrapper<PlatformUserResponseDto>> {
    const platformUser = await this.platformUserService.createPlatformUser(dto);
    if (platformUser) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Platform User created successfully',
        platformUser,
      );
    } else {
      throw new HttpException(
        'Failed to create Platform User',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
  ): Promise<ApiResponseWrapper<PlatformUserResponseDto>> {
    const platformUser =
      await this.platformUserService.getPlatformUserViaEmail(query);
    if (platformUser) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Platform User found',
        platformUser,
      );
    } else {
      throw new HttpException('Platform User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('get/id')
  @ApiBearerAuth('JWT')
  @UseGuards(PlatformUserJwtGuard)
  @ApiOperation({ summary: 'Get the Platform User by id' })
  @ApiResponse({
    status: 200,
    description: 'Platform User found',
    type: PlatformUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Platform User not found' })
  async getPlatformUserViaId(
    @Query() query: GetPlatformUserViaIdDto,
  ): Promise<ApiResponseWrapper<PlatformUserResponseDto>> {
    const platformUser =
      await this.platformUserService.getPlatformUserViaId(query);
    if (platformUser) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Platform User found',
        platformUser,
      );
    } else {
      throw new HttpException('Platform User not found', HttpStatus.NOT_FOUND);
    }
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
  @ApiResponse({ status: 404, description: 'User not Found' })
  async getJwtForPlatformUser(
    @Query() query: GetJwtForPlatformUserDto,
  ): Promise<ApiResponseWrapper<PlatformUserJwtResponseDto>> {
    const jwt: string =
      await this.platformUserService.getSignedJwtTokenForUser(query);
    if (jwt) {
      return new ApiResponseWrapper(HttpStatus.OK, 'JWT token created', {
        jwt,
      });
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
