import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  PlatformCreateScreeningJobDto,
  PlatformScreeningJobResponseDto,
} from './dto/platform-screening-job-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlatformScreeningJobService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createScreeningJob(
    dto: PlatformCreateScreeningJobDto,
  ): Promise<PlatformScreeningJobResponseDto> {
    try {
      const screeningJob = await this.prisma.screeningJob.create({
        data: dto,
      });
      return screeningJob;
    } catch (error) {
      this.logger.error(
        `Unable to create screening job: ${error}`,
        error.stack,
        'PlatformScreeningJobService/createScreeningJob',
      );
      throw new NotFoundException('Unable to create screening job');
    }
  }

  async getScreeningJobById(
    id: string,
  ): Promise<PlatformScreeningJobResponseDto> {
    try {
      const screeningJob = await this.prisma.screeningJob.findUnique({
        where: { id },
      });
      if (!screeningJob) {
        throw new NotFoundException('Screening job not found');
      }
      return screeningJob;
    } catch (error) {
      this.logger.error(
        `Unable to get screening job by id: ${error}`,
        error.stack,
        'PlatformScreeningJobService/getScreeningJobById',
      );
      throw new NotFoundException('Screening job not found');
    }
  }

  async getScreeningJobsOfOrg(
    orgId: string,
  ): Promise<PlatformScreeningJobResponseDto[]> {
    try {
      const screeningJobs = await this.prisma.screeningJob.findMany({
        where: {
          orgId,
        },
      });
      return screeningJobs;
    } catch (error) {
      this.logger.error(
        `Unable to get screening jobs of org: ${error}`,
        error.stack,
        'PlatformScreeningJobService/getScreeningJobsOfOrg',
      );
      return [];
    }
  }
}
