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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PlatformUserModule,
    PlatformOrganisationModule,
    PlatformScreeningJobsModule,
    PlatformScreeningTemplatesModule,
    LlmModule,
    AwsModule,
    LivekitModule,
  ],
})
export class AppModule {}
