import { Module } from '@nestjs/common';
import { PlatformUserController } from './platform-user.controller';
import { PlatformUserService } from './platform-user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PlatformUserController],
  providers: [PlatformUserService],
})
export class PlatformUserModule {}
