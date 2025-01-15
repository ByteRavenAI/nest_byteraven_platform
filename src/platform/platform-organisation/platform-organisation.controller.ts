import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlatformOrganisationService } from './platform-organisation.service';
import {
  CreatePlatformOrganisationDto,
  GetPlatformOrganisationViaIdDto,
  GetPlatformUserViaAdminIdDto,
} from './dto/platform-organisation-dto';
import { GetPlatformOrganisationApiKeyDto } from './dto/platform-organisation-apikey-dto';

@Controller('organisation')
export class PlatformOrganisationController {
  constructor(private organisationService: PlatformOrganisationService) {}

  @Post()
  async createOrganisation(@Body() dto: CreatePlatformOrganisationDto) {
    return this.organisationService.createOrganisation(dto);
  }

  @Get()
  async getOrganisationById(@Query() dto: GetPlatformOrganisationViaIdDto) {
    return this.organisationService.getOrganisationById(dto);
  }

  @Get('admin')
  async createOrganisationsByAdminId(
    @Query() dto: GetPlatformUserViaAdminIdDto,
  ) {
    return this.organisationService.getOrganisationsByAdminId(dto);
  }

  @Get('api-key')
  async getOrganisationApiKey(@Query() dto: GetPlatformOrganisationApiKeyDto) {
    return this.organisationService.getOrganisationApiKey(dto);
  }
}
