import { Module } from '@nestjs/common';
import { PlatformScreeningTemplatesController } from './platform-screening-templates.controller';
import { PlatformScreeningTemplatesService } from './platform-screening-templates.service';
import { LlmService } from 'src/llm/llm.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [PlatformScreeningTemplatesController],
  providers: [PlatformScreeningTemplatesService, LlmService, AwsService]
})
export class PlatformScreeningTemplatesModule {}
