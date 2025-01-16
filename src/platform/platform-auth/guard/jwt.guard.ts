import { AuthGuard } from '@nestjs/passport';

export class PlatformUserJwtGuard extends AuthGuard('platform-user-jwt') {
  constructor() {
    super();
  }
}