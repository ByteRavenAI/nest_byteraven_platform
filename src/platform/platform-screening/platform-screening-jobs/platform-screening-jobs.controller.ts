import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';
import {
  PlatformCreateScreeningJobDto,
  PlatformGetScreeningJobByIdDto,
  PlatformScreeningJobListResponseDto,
  PlatformScreeningJobResponseDto,
} from './dto/platform-screening-job-dto';
import { PlatformScreeningJobService } from './platform-screening-jobs.service';
import { PlatformOrgApiKeyGuard } from 'src/platform/platform-auth/guard/apikey.guard';

@ApiTags('Platform Screening Jobs')
@UseGuards(PlatformUserJwtGuard)
@Controller('platform-screening-jobs')
export class PlatformScreeningJobsController {
  constructor(
    private platformScreeningJobService: PlatformScreeningJobService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Job' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Screening Job Created Successfully',
    type: PlatformScreeningJobResponseDto,
  })
  async createScreeningJob(@Body() dto: PlatformCreateScreeningJobDto) {
    const response =
      await this.platformScreeningJobService.createScreeningJob(dto);
    if (response) {
      return response;
    } else {
      return { message: 'Error Creating Screening Job' };
    }
  }

  @Get('org')
  @ApiOperation({ summary: 'Get all Screening Jobs of Organisation' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Screening Jobs of Organisation',
    type: PlatformScreeningJobListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No Screening Jobs Found for Organisation',
  })
  async getScreeningJobsOfOrg(@Req() req: Request) {
    // Access organization details from req.user
    const { orgId, orgAlias } = req.user as {
      orgId: string;
      orgAlias: string;
    };
    const jobs =
      await this.platformScreeningJobService.getScreeningJobsOfOrg(orgId);

    if (jobs.length > 0) {
      return jobs;
    } else {
      return { message: 'No Screening Jobs Found for Organisation' };
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
  async getScreeningJobUsingId(@Query() dto: PlatformGetScreeningJobByIdDto) {
    const job = await this.platformScreeningJobService.getScreeningJobById(
      dto.screeningJobId,
    );

    if (job) {
      return job;
    } else {
      return { message: 'No Screening Job Found' };
    }
  }
}
