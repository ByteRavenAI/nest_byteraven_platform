import { Module } from '@nestjs/common';
import { PlatformScreeningJobsController } from './platform-screening-jobs.controller';
import { PlatformScreeningJobsService } from './platform-screening-jobs.service';

@Module({
  controllers: [PlatformScreeningJobsController],
  providers: [PlatformScreeningJobsService]
})
export class PlatformScreeningJobsModule {}
