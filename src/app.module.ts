import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlatformUserModule } from './platform/platform-user/platform-user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlatformOrganisationModule } from './platform/platform-organisation/platform-organisation.module';
import { LlmModule } from './llm/llm.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PlatformUserModule,
    PlatformOrganisationModule,
    LlmModule,
    AwsModule,
  ],
})
export class AppModule {}
