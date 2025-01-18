import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';
import {
  PlatformCreateScreeningJobDto,
  PlatformGetScreeningJobByIdDto,
  PlatformScreeningJobsByOrgIdDto,
} from './dto/platform-screening-job-dto';
import { PlatformScreeningJobService } from './platform-screening-jobs.service';

@ApiTags('Platform Screening Jobs')
@UseGuards(PlatformUserJwtGuard)
@Controller('platform-screening-jobs')
export class PlatformScreeningJobsController {
  constructor(
    private platformScreeningJobService: PlatformScreeningJobService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Job' })
  async createScreeningJob(@Body() dto: PlatformCreateScreeningJobDto) {
    return this.platformScreeningJobService.createScreeningJob(dto);
  }

  @Get('org')
  @ApiOperation({ summary: 'Get all Screening Jobs of Organisation' })
  async getScreeningJobsOfOrg(@Query() dto: PlatformScreeningJobsByOrgIdDto) {
    return this.platformScreeningJobService.getScreeningJobsOfOrg(dto.orgId);
  }

  @Get('id')
  @ApiOperation({ summary: 'Get Screening Job using Id' })
  async getScreeningJobUsingId(@Query() dto: PlatformGetScreeningJobByIdDto) {
    return this.platformScreeningJobService.getScreeningJobById(
      dto.screeningJobId,
    );
  }
}
