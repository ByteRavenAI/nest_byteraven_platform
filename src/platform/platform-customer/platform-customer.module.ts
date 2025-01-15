import { Module } from '@nestjs/common';
import { PlatformCustomerController } from './platform-customer.controller';
import { PlatformCustomerService } from './platform-customer.service';

@Module({
  controllers: [PlatformCustomerController],
  providers: [PlatformCustomerService]
})
export class PlatformCustomerModule {}
