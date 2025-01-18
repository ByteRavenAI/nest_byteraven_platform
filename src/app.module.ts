import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlatformUserModule } from './platform/platform-user/platform-user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlatformOrganisationModule } from './platform/platform-organisation/platform-organisation.module';
import { LlmModule } from './llm/llm.module';
import { AwsModule } from './aws/aws.module';
import { PlatformScreeningJobsModule } from './platform/platform-screening/platform-screening-jobs/platform-screening-jobs.module';
import { PlatformScreeningTemplatesModule } from './platform/platform-screening/platform-screening-templates/platform-screening-templates.module';
import { LivekitModule } from './livekit/livekit.module';
import { PlatformScreeningSubmissionsModule } from './platform/platform-screening/platform-screening-submissions/platform-screening-submissions.module';
import { StripeModule } from './stripe/stripe.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('ByteRaven Platform', {
                colors: true,
                prettyPrint: true,
                processId: true,
                appName: true,
              }),
            ),
          }),
          // other transports...
        ],
      }),
      inject: [],
    }),

    PrismaModule,

    PlatformUserModule,
    PlatformOrganisationModule,
    PlatformScreeningJobsModule,
    PlatformScreeningTemplatesModule,
    PlatformScreeningSubmissionsModule,
    LlmModule,
    AwsModule,
    LivekitModule,
    StripeModule,
  ],
})
export class AppModule {}
