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
    orgId: string,
    orgAlias: string,
  ): Promise<PlatformScreeningJobResponseDto> {
    try {
      const screeningJob = await this.prisma.screeningJob.create({
        data: {
          orgId,
          orgAlias,
          title: dto.title,
          jd: dto.jd,
          upvotes: [],
          createdAt: dto.createdAt,
          screeningTemplateId: dto.screeningTemplateId,
          jobActive: dto.jobActive,
        },
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

      screeningJob.screeningJobId = screeningJob.id;

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

      for(let i = 0; i < screeningJobs.length; i++) {
        screeningJobs[i] = {
          screeningJobId: screeningJobs[i].id,
          ...screeningJobs[i],
        }
      }

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
