import { Module } from '@nestjs/common';
import { PlatformUserController } from './platform-user.controller';
import { PlatformUserService } from './platform-user.service';

@Module({
  controllers: [PlatformUserController],
  providers: [PlatformUserService]
})
export class PlatformUserModule {}
