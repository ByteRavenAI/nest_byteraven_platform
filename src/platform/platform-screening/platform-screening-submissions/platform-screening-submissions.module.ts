import { Module } from '@nestjs/common';
import { PlatformScreeningSubmissionsController } from './platform-screening-submissions.controller';
import { PlatformScreeningSubmissionsService } from './platform-screening-submissions.service';

@Module({
  controllers: [PlatformScreeningSubmissionsController],
  providers: [PlatformScreeningSubmissionsService]
})
export class PlatformScreeningSubmissionsModule {}
