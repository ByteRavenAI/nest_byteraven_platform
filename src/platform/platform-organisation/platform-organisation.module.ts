import { Logger, Module } from '@nestjs/common';
import { PlatformOrganisationController } from './platform-organisation.controller';
import { PlatformOrganisationService } from './platform-organisation.service';
import { StripeService } from 'src/stripe/stripe.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [PlatformOrganisationController],
  providers: [PlatformOrganisationService, StripeService, Logger, AwsService],
})
export class PlatformOrganisationModule {}
