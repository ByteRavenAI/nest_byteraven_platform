import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlatformOrganisationService } from './platform-organisation.service';
import {
  CreatePlatformOrganisationDto,
  GetPlatformOrganisationViaIdDto,
  GetPlatformUserViaAdminIdDto,
} from './dto/platform-organisation-dto';
import { GetPlatformOrganisationApiKeyDto } from './dto/platform-organisation-apikey-dto';
import { PlatformUserJwtGuard } from '../platform-auth/guard/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateOrganisationBillingStripePaymentSessionDto,
  GetOrganisationBillingViaOrgIdDto,
} from './dto/platform-organisation-billing-dto';
import {
  CreateOrganisationMemberStatusDto,
  GetOrganisationMemberStatusOfUser,
  UpdateOrganisationMemberStatusDto,
} from './dto/platform-organisation-member-dto';
import { PlatformOrgApiKeyGuard } from '../platform-auth/guard/apikey.guard';

@ApiTags('Platform Organisation')
@Controller('organisation')
export class PlatformOrganisationController {
  constructor(private organisationService: PlatformOrganisationService) {}

  @Post()
  @UseGuards(PlatformUserJwtGuard)
  @ApiOperation({ summary: 'Create a new Organisation' })
  async createOrganisation(@Body() dto: CreatePlatformOrganisationDto) {
    return this.organisationService.createOrganisation(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Organisation by Id' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  async getOrganisationById(@Query() dto: GetPlatformOrganisationViaIdDto) {
    return this.organisationService.getOrganisationById(dto);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get Organisations by Admin Id' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
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

  @Get('billing')
  @ApiOperation({ summary: 'Get Organisation Billing' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  async getOrganisationBilling(
    @Query() dto: GetOrganisationBillingViaOrgIdDto,
  ) {
    return this.organisationService.getOrganisationBilling(dto.orgId);
  }

  @Post('billing/stripe/session')
  @ApiOperation({
    summary: 'Create Organisation Billing Stripe Payment Session',
  })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  async createOrganisationBillingStripePaymentSession(
    @Body() dto: CreateOrganisationBillingStripePaymentSessionDto,
  ) {
    return this.organisationService.createOrganisationBillingStripePaymentSession(
      dto,
    );
  }

  @Post('billing/stripe/payment/webhook')
  @ApiOperation({
    summary: 'Create Organisation Billing Stripe Payment Webhook Handler',
  })
  async createOrganisationBillingPaymentSessionTransactionWebhookHandler(
    @Body() dto: any,
  ) {
    return this.organisationService.createOrganisationBillingPaymentSessionTransactionWebhookHandler(
      dto,
    );
  }

  @Post('member')
  @ApiOperation({ summary: "Create an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  async createOrganisationMemberStatus(
    @Body() dto: CreateOrganisationMemberStatusDto,
  ) {
    return this.organisationService.createOrganisationMemberStatus(dto);
  }

  @Post('member/get')
  @ApiOperation({ summary: "Get an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  async getOrganisationMemberStatus(
    @Query() dto: GetOrganisationMemberStatusOfUser,
  ) {
    return this.organisationService.getOrganisationMemberStatusOfaUser(dto);
  }

  @Post('member/getAll')
  @ApiOperation({ summary: "Get all Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  async getAllOrganisationMemberStatus(@Query() dto: any) {
    return this.organisationService.getAllOrganisationMemberStatus(dto);
  }

  @Put('member')
  @ApiOperation({ summary: "Update an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  async updateOrganisationMemberStatus(
    @Body() dto: UpdateOrganisationMemberStatusDto,
  ) {
    return this.organisationService.updateOrganisationMemberStatus(dto);
  }

  // @Post('member/platformUser')
  // @ApiOperation({
  //   summary: "Get an Organisation's Member Statuses of Platform User",
  // })
  // async getOrganisationMemberStatusOfPlatformUser(@Body() dto: any) {
  //   return this.organisationService.getOrganisationMemberStatusOfPlatformUser(
  //     dto,
  //   );
  // }
}
