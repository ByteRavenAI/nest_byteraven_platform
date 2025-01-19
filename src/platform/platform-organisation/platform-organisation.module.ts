import { Logger, Module } from '@nestjs/common';
import { PlatformOrganisationController } from './platform-organisation.controller';
import { PlatformOrganisationService } from './platform-organisation.service';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  controllers: [PlatformOrganisationController],
  providers: [PlatformOrganisationService, StripeService, Logger],
})
export class PlatformOrganisationModule {}
