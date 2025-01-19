import { Logger, Module } from '@nestjs/common';
import { PlatformUserController } from './platform-user.controller';
import { PlatformUserService } from './platform-user.service';
import { JwtModule } from '@nestjs/jwt';
import { PlatformUserJwtStrategy } from '../platform-auth/strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PlatformUserController],
  providers: [PlatformUserService, PlatformUserJwtStrategy, Logger],
})
export class PlatformUserModule {}
