import { AuthGuard } from '@nestjs/passport';

export class PlatformOrgApiKeyGuard extends AuthGuard('platform-org-api-key') {
  constructor() {
    super();
  }
}
