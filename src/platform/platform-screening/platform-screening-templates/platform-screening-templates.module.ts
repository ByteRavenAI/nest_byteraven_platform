import { Module } from '@nestjs/common';
import { PlatformScreeningTemplatesController } from './platform-screening-templates.controller';
import { PlatformScreeningTemplatesService } from './platform-screening-templates.service';

@Module({
  controllers: [PlatformScreeningTemplatesController],
  providers: [PlatformScreeningTemplatesService]
})
export class PlatformScreeningTemplatesModule {}
