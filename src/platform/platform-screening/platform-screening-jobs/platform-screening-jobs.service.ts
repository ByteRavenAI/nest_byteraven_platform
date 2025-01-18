import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PlatformCreateScreeningJobDto,
  PlatformScreeningJobResponseDto,
} from './dto/platform-screening-job-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlatformScreeningJobService {
  constructor(private prisma: PrismaService) {}

  async createScreeningJob(
    dto: PlatformCreateScreeningJobDto,
  ): Promise<PlatformScreeningJobResponseDto> {
    const screeningJob = await this.prisma.screeningJob.create({
      data: dto,
    });
    return screeningJob;
  }

  async getScreeningJobById(
    id: string,
  ): Promise<PlatformScreeningJobResponseDto> {
    const screeningJob = await this.prisma.screeningJob.findUnique({
      where: { id },
    });
    if (!screeningJob) {
      throw new NotFoundException('Screening job not found');
    }
    return screeningJob;
  }

  async getScreeningJobsOfOrg(
    orgId: string,
  ): Promise<PlatformScreeningJobResponseDto[]> {
    const screeningJobs = await this.prisma.screeningJob.findMany({
      where: {
        orgId,
      },
    });
    return screeningJobs;
  }
}
