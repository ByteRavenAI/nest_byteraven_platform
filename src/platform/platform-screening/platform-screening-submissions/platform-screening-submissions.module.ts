import { Module } from '@nestjs/common';
import { PlatformScreeningSubmissionsController } from './platform-screening-submissions.controller';
import { PlatformScreeningSubmissionsService } from './platform-screening-submissions.service';
import { LivekitService } from 'src/livekit/livekit.service';
import { AwsService } from 'src/aws/aws.service';
import { LlmService } from 'src/llm/llm.service';

@Module({
  controllers: [PlatformScreeningSubmissionsController],
  providers: [PlatformScreeningSubmissionsService, LivekitService, AwsService, LlmService]
})
export class PlatformScreeningSubmissionsModule {}
