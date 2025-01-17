import { Global, Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Global()
@Module({
  providers: [AwsService]
})
export class AwsModule {}
