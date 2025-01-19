import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlatformOrganisationService } from './platform-organisation.service';
import { Request } from 'express';
import {
  CreatePlatformOrganisationDto,
  GetPlatformOrganisationViaIdDto,
  GetPlatformUserViaAdminIdDto,
  PlatformOrganisationResponseDto,
  PlatformOrganisationsListResponseDto,
} from './dto/platform-organisation-dto';
import {
  GetPlatformOrganisationApiKeyDto,
  GetPlatformOrganisationApiKeyResponseDto,
} from './dto/platform-organisation-apikey-dto';
import { PlatformUserJwtGuard } from '../platform-auth/guard/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateOrganisationBillingStripePaymentSessionDto,
  CreatePlatformOrganisationBillingStripeSessionResponseDto,
  GetOrganisationBillingViaOrgIdDto,
  GetOrganisationBillingViaOrgIdResponseDto,
} from './dto/platform-organisation-billing-dto';
import {
  CreateOrganisationMemberStatusDto,
  GetAllOrganisationMemberStatusOfOrgListResponseDto,
  GetOrganisationMemberStatusOfUser,
  GetOrganisationMemberStatusResponseDto,
  UpdateOrganisationMemberStatusDto,
} from './dto/platform-organisation-member-dto';
import { PlatformOrgApiKeyGuard } from '../platform-auth/guard/apikey.guard';

@ApiTags('Platform Organisation')
@Controller('organisation')
export class PlatformOrganisationController {
  constructor(private organisationService: PlatformOrganisationService) {}

  @Post()
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Organisation' })
  @ApiResponse({
    status: 201,
    description: 'Organisation Created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createOrganisation(@Body() dto: CreatePlatformOrganisationDto) {
    const success = await this.organisationService.createOrganisation(dto);
    if (success) {
      return { success: true, message: 'Organisation created successfully' };
    }

    return { success: false, message: 'Organisation creation failed' };
  }

  @Get()
  @ApiOperation({ summary: 'Get Organisation by Id' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organisation Found',
    type: PlatformOrganisationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getOrganisationById(@Query() dto: GetPlatformOrganisationViaIdDto) {
    const success = await this.organisationService.getOrganisationById(dto);

    if (success) {
      return success;
    } else {
      return { success: false, message: 'Organisation not found' };
    }
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get Organisations by Admin Id' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organisations Found',
    type: PlatformOrganisationsListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createOrganisationsByAdminId(
    @Query() dto: GetPlatformUserViaAdminIdDto,
  ) {
    const orgs = await this.organisationService.getOrganisationsByAdminId(dto);
    if (orgs) {
      return orgs;
    }
    return { success: false, message: 'Organisations not found' };
  }

  @Get('api-key')
  @ApiOperation({ summary: 'Get Organisation API Key' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organisation API Key Found',
    type: GetPlatformOrganisationApiKeyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getOrganisationApiKey(@Req() req: Request) {
    const { orgId, orgAlias } = req.user as {
      orgId: string;
      orgAlias: string;
    };
    const response =
      await this.organisationService.getOrganisationApiKey(orgId);
    if (response) {
      return response;
    } else {
      return { success: false, message: 'Organisation API Key not found' };
    }
  }

  @Get('billing')
  @ApiOperation({ summary: 'Get Organisation Billing' })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Organisation Billing Found',
    type: GetOrganisationBillingViaOrgIdResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getOrganisationBilling(
    @Query() dto: GetOrganisationBillingViaOrgIdDto,
  ) {
    const billing = await this.organisationService.getOrganisationBilling(
      dto.orgId,
    );

    if (billing) {
      return billing;
    }
    return { success: false, message: 'Organisation Billing not found' };
  }

  @Post('billing/stripe/session')
  @ApiOperation({
    summary: 'Create Organisation Billing Stripe Payment Session',
  })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Payment Session created successfully',
    type: CreatePlatformOrganisationBillingStripeSessionResponseDto,
  })
  async createOrganisationBillingStripePaymentSession(
    @Body() dto: CreateOrganisationBillingStripePaymentSessionDto,
  ) {
    const response =
      await this.organisationService.createOrganisationBillingStripePaymentSession(
        dto,
      );
    if (response) {
      return response;
    } else {
      return { success: false, message: 'Payment Session creation failed' };
    }
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Member Status Created',
  })
  async createOrganisationMemberStatus(
    @Body() dto: CreateOrganisationMemberStatusDto,
  ) {
    const success =
      await this.organisationService.createOrganisationMemberStatus(dto);
    if (success) {
      return { success: true, message: 'Member Status created successfully' };
    } else {
      return { success: false, message: 'Member Status creation failed' };
    }
  }

  @Post('member/get')
  @ApiOperation({ summary: "Get an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Member Status Found',
    type: GetOrganisationMemberStatusResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getOrganisationMemberStatus(
    @Query() dto: GetOrganisationMemberStatusOfUser,
  ) {
    const response =
      await this.organisationService.getOrganisationMemberStatusOfaUser(dto);
    if (response) {
      return response;
    } else {
      return { success: false, message: 'Member Status not found' };
    }
  }

  @Post('member/getAll')
  @ApiOperation({ summary: "Get all Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Member Status Found',
    type: GetAllOrganisationMemberStatusOfOrgListResponseDto,
  })
  async getAllOrganisationMemberStatus(@Query() dto: any) {
    const statuses =
      await this.organisationService.getAllOrganisationMemberStatus(dto);
    if (statuses) {
      return statuses;
    }
    return { success: false, message: 'Member Status not found' };
  }

  @Put('member')
  @ApiOperation({ summary: "Update an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  async updateOrganisationMemberStatus(
    @Body() dto: UpdateOrganisationMemberStatusDto,
  ) {
    const success =
      await this.organisationService.updateOrganisationMemberStatus(dto);

    if (success) {
      return { success: true, message: 'Member Status updated successfully' };
    } else {
      return { success: false, message: 'Member Status update failed' };
    }
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
