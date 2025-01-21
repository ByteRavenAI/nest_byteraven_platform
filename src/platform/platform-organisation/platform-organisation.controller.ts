import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
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
  ApiBasicAuth,
  ApiConsumes,
  ApiSecurity,
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
import { HttpExceptionFilter } from 'src/helpers/http-exception-filter';
import { ApiResponseWrapper } from 'src/helpers/http-response-wrapper';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Platform Organisation')
@Controller('organisation')
@UseFilters(HttpExceptionFilter)
export class PlatformOrganisationController {
  constructor(private organisationService: PlatformOrganisationService) {}

  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(PlatformUserJwtGuard)
  @ApiOperation({ summary: 'Create a new Organisation' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Organisation Created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createOrganisation(
    @Body() dto: CreatePlatformOrganisationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const success = await this.organisationService.createOrganisation(
      file,
      dto,
    );

    if (success) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Organisation created successfully',
        success,
      );
    }

    throw new HttpException(
      'Failed to create Organisation',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get Organisation by Id' })
  @UseGuards(PlatformUserJwtGuard)
  // @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  // @ApiBasicAuth('API_KEY')
  @ApiResponse({
    status: 200,
    description: 'Organisation Found',
    type: PlatformOrganisationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getOrganisationById(
    @Query() dto: GetPlatformOrganisationViaIdDto,
  ): Promise<ApiResponseWrapper<PlatformOrganisationResponseDto>> {
    const success = await this.organisationService.getOrganisationById(dto);

    if (success) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Organisation found successfully',
        success,
      );
    } else {
      throw new HttpException('Organisation not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get Organisations by Admin Id' })
  @UseGuards(PlatformUserJwtGuard)
  // @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  // @ApiBasicAuth('API_KEY')
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
  ): Promise<ApiResponseWrapper<PlatformOrganisationsListResponseDto>> {
    const orgs = await this.organisationService.getOrganisationsByAdminId(dto);
    if (orgs) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Organisations found successfully',
        orgs,
      );
    }
    throw new HttpException('Organisations not found', HttpStatus.BAD_REQUEST);
  }

  @Get('api-key')
  @ApiOperation({ summary: 'Get Organisation API Key' })
  @UseGuards(PlatformUserJwtGuard)
  // @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  // @ApiBasicAuth('API_KEY')
  @ApiResponse({
    status: 200,
    description: 'Organisation API Key Found',
    type: GetPlatformOrganisationApiKeyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async getOrganisationApiKey(
    // @Req() req: Request,
    @Query() dto: GetPlatformOrganisationApiKeyDto,
  ): Promise<ApiResponseWrapper<GetPlatformOrganisationApiKeyResponseDto>> {
    // const { orgId, orgAlias } = req.user as {
    //   orgId: string;
    //   orgAlias: string;
    // };
    const response = await this.organisationService.getOrganisationApiKey(
      dto.organisationId,
    );
    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Organisation API Key found',
        response,
      );
    } else {
      throw new HttpException(
        'Organisation API Key not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('billing')
  @ApiOperation({ summary: 'Get Organisation Billing' })
  @UseGuards(PlatformUserJwtGuard)
  // @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  // @ApiBasicAuth('X-API-KEY')
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
  ): Promise<ApiResponseWrapper<GetOrganisationBillingViaOrgIdResponseDto>> {
    const billing = await this.organisationService.getOrganisationBilling(
      dto.orgId,
    );

    if (billing) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Organisation Billing found',
        billing,
      );
    }
    throw new HttpException(
      'Organisation Billing not found',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Post('billing/stripe/session')
  @ApiOperation({
    summary: 'Create Organisation Billing Stripe Payment Session',
  })
  @UseGuards(PlatformUserJwtGuard)
  // @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  // @ApiBasicAuth('X-API-KEY')
  @ApiResponse({
    status: 201,
    description: 'Payment Session created successfully',
    type: CreatePlatformOrganisationBillingStripeSessionResponseDto,
  })
  async createOrganisationBillingStripePaymentSession(
    @Body() dto: CreateOrganisationBillingStripePaymentSessionDto,
  ): Promise<
    ApiResponseWrapper<CreatePlatformOrganisationBillingStripeSessionResponseDto>
  > {
    const response =
      await this.organisationService.createOrganisationBillingStripePaymentSession(
        dto,
      );
    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Payment Session created successfully',
        response,
      );
    } else {
      throw new HttpException(
        'Failed to create Payment Session',
        HttpStatus.BAD_REQUEST,
      );
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
  @ApiBearerAuth('JWT')
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 201,
    description: 'Member Status Created',
  })
  async createOrganisationMemberStatus(
    @Body() dto: CreateOrganisationMemberStatusDto,
  ): Promise<ApiResponseWrapper<any>> {
    const success =
      await this.organisationService.createOrganisationMemberStatus(dto);
    if (success) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Member Status created successfully',
        success,
      );
    } else {
      throw new HttpException(
        'Failed to create Member Status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('member/get')
  @ApiOperation({ summary: "Get an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  @ApiBasicAuth('X-API-KEY')
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
  ): Promise<ApiResponseWrapper<GetOrganisationMemberStatusResponseDto>> {
    const response =
      await this.organisationService.getOrganisationMemberStatusOfaUser(dto);
    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Member Status found',
        response,
      );
    } else {
      throw new HttpException(
        'Member Status not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('member/getAll')
  @ApiOperation({ summary: "Get all Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiBearerAuth('JWT')
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Member Status Found',
    type: GetAllOrganisationMemberStatusOfOrgListResponseDto,
  })
  async getAllOrganisationMemberStatus(
    @Req() req: Request,
  ): Promise<
    ApiResponseWrapper<GetAllOrganisationMemberStatusOfOrgListResponseDto>
  > {
    const { orgId, orgAlias } = req.org as {
      orgId: string;
      orgAlias: string;
    };
    const statuses =
      await this.organisationService.getAllOrganisationMemberStatus(orgId);
    if (statuses) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Member Status found',
        statuses,
      );
    }
    throw new HttpException('Member Status not found', HttpStatus.BAD_REQUEST);
  }

  @Put('member')
  @ApiOperation({ summary: "Update an Organisation's Member Status" })
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth('JWT')
  @ApiBasicAuth('X-API-KEY')
  async updateOrganisationMemberStatus(
    @Body() dto: UpdateOrganisationMemberStatusDto,
  ): Promise<ApiResponseWrapper<any>> {
    const success =
      await this.organisationService.updateOrganisationMemberStatus(dto);

    if (success) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Member Status updated successfully',
        success,
      );
    } else {
      throw new HttpException(
        'Failed to update Member Status',
        HttpStatus.BAD_REQUEST,
      );
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
