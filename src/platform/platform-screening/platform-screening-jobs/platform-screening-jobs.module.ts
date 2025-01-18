import { Module } from '@nestjs/common';
import { PlatformScreeningJobsController } from './platform-screening-jobs.controller';
import { PlatformScreeningJobService } from './platform-screening-jobs.service';
import { AwsService } from 'src/aws/aws.service';
import { LlmService } from 'src/llm/llm.service';

@Module({
  controllers: [PlatformScreeningJobsController],
  providers: [PlatformScreeningJobService, LlmService, AwsService],
})
export class PlatformScreeningJobsModule {}
