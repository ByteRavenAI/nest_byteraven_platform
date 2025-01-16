import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PlatformOrganisationService } from './platform-organisation.service';
import {
  CreatePlatformOrganisationDto,
  GetPlatformOrganisationViaIdDto,
  GetPlatformUserViaAdminIdDto,
} from './dto/platform-organisation-dto';
import { GetPlatformOrganisationApiKeyDto } from './dto/platform-organisation-apikey-dto';
import { PlatformUserJwtGuard } from '../platform-auth/guard/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Platform Organisation')
@UseGuards(PlatformUserJwtGuard)
@Controller('organisation')
export class PlatformOrganisationController {
  constructor(private organisationService: PlatformOrganisationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Organisation' })
  async createOrganisation(@Body() dto: CreatePlatformOrganisationDto) {
    return this.organisationService.createOrganisation(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Organisation by Id' })
  async getOrganisationById(@Query() dto: GetPlatformOrganisationViaIdDto) {
    return this.organisationService.getOrganisationById(dto);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get Organisations by Admin Id' })
  async createOrganisationsByAdminId(
    @Query() dto: GetPlatformUserViaAdminIdDto,
  ) {
    return this.organisationService.getOrganisationsByAdminId(dto);
  }

  @Get('api-key')
  @ApiOperation({ summary: 'Get Organisation API Key' })
  async getOrganisationApiKey(@Query() dto: GetPlatformOrganisationApiKeyDto) {
    return this.organisationService.getOrganisationApiKey(dto);
  }
}
