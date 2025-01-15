import { Module } from '@nestjs/common';
import { PlatformOrganisationController } from './platform-organisation.controller';
import { PlatformOrganisationService } from './platform-organisation.service';

@Module({
  controllers: [PlatformOrganisationController],
  providers: [PlatformOrganisationService],
})
export class PlatformOrganisationModule {}
