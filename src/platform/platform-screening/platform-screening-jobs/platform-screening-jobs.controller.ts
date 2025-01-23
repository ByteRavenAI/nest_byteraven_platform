import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  PlatformCreateScreeningJobDto,
  PlatformGetScreeningJobByIdDto,
  PlatformScreeningJobListResponseDto,
  PlatformScreeningJobResponseDto,
} from './dto/platform-screening-job-dto';
import { PlatformScreeningJobService } from './platform-screening-jobs.service';
import { PlatformOrgApiKeyGuard } from 'src/platform/platform-auth/guard/apikey.guard';
import { HttpExceptionFilter } from 'src/helpers/http-exception-filter';
import { ApiResponseWrapper } from 'src/helpers/http-response-wrapper';

@UseFilters(HttpExceptionFilter)
@ApiTags('Platform Screening Jobs')
@Controller('platform/platform-screening-job')
export class PlatformScreeningJobsController {
  constructor(
    private platformScreeningJobService: PlatformScreeningJobService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Job' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 201,
    description: 'Screening Job Created Successfully',
    type: PlatformScreeningJobResponseDto,
  })
  async createScreeningJob(
    @Req() req: Request,
    @Body() dto: PlatformCreateScreeningJobDto,
  ): Promise<ApiResponseWrapper<PlatformScreeningJobResponseDto>> {
    const { orgId, orgAlias } = req.org as {
      orgId: string;
      orgAlias: string;
    };
    const response = await this.platformScreeningJobService.createScreeningJob(
      dto,
      orgId,
      orgAlias,
    );
    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Screening Job Created Successfully',
        response,
      );
    } else {
      throw new HttpException(
        'Failed to create Screening Job',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('org')
  @ApiOperation({ summary: 'Get all Screening Jobs of Organisation' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Jobs of Organisation',
    type: PlatformScreeningJobListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No Screening Jobs Found for Organisation',
  })
  async getScreeningJobsOfOrg(
    @Req() req: Request,
  ): Promise<ApiResponseWrapper<PlatformScreeningJobListResponseDto>> {
    // Access organization details from req.user
    const { orgId, orgAlias } = req.org as {
      orgId: string;
      orgAlias: string;
    };
    const jobs =
      await this.platformScreeningJobService.getScreeningJobsOfOrg(orgId);

    if (jobs.length > 0) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Jobs of Organisation',
        { screeningJobs: jobs },
      );
    } else {
      throw new HttpException(
        'No Screening Jobs Found for Organisation',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('id')
  @ApiOperation({ summary: 'Get Screening Job using Id' })
  @ApiResponse({
    status: 200,
    description: 'Screening Job Found',
    type: PlatformScreeningJobResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No Screening Job Found',
  })
  async getScreeningJobUsingId(
    @Query() dto: PlatformGetScreeningJobByIdDto,
  ): Promise<ApiResponseWrapper<PlatformScreeningJobResponseDto>> {
    const job = await this.platformScreeningJobService.getScreeningJobById(
      dto.screeningJobId,
    );

    if (job) {
      return new ApiResponseWrapper(HttpStatus.OK, 'Screening Job Found', job);
    } else {
      throw new HttpException('No Screening Job Found', HttpStatus.NOT_FOUND);
    }
  }
}
