import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';
import {
  CreateScreeningJobDto,
  GetScreeningJobByIdDto,
  ScreeningJobsByOrgIdDto,
} from './dto/platform-screening-job-dto';
import { PlatformScreeningJobService } from './platform-screening-jobs.service';

@UseGuards(PlatformUserJwtGuard)
@ApiTags('Platform Screening Jobs')
@Controller('platform-screening-jobs')
export class PlatformScreeningJobsController {
  constructor(
    private platformScreeningJobService: PlatformScreeningJobService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Job' })
  async createScreeningJob(@Body() dto: CreateScreeningJobDto) {
    return this.platformScreeningJobService.createScreeningJob(dto);
  }

  @Get('org')
  @ApiOperation({ summary: 'Get all Screening Jobs of Organisation' })
  async getScreeningJobsOfOrg(@Query() dto: ScreeningJobsByOrgIdDto) {
    return this.platformScreeningJobService.getScreeningJobsOfOrg(dto.orgId);
  }

  @Get('id')
  @ApiOperation({ summary: 'Get Screening Job using Id' })
  async getScreeningJobUsingId(@Query() dto: GetScreeningJobByIdDto) {
    return this.platformScreeningJobService.getScreeningJobById(
      dto.screeningJobId,
    );
  }
}
