import { AuthGuard } from '@nestjs/passport';

// export class PlatformOrgApiKeyGuard extends AuthGuard('platform-org-api-key') {
//   constructor() {
//     super();
//   }
// }

// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlatformOrgApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey: string | null = request.headers['x-api-key'] as string; // Assuming API key is sent in header

    if (!apiKey) {
      console.error('API key is missing');
      throw new UnauthorizedException('API key is missing');
    }

    console.log('Validating API key:', apiKey);

    const apiKeyDoc = await this.prisma.organisationApiKey.findUnique({
      where: { apiKey },
    });

    if (!apiKeyDoc) {
      console.error('Invalid API key:', apiKey);
      throw new UnauthorizedException('Invalid API key');
    }

    console.log('API key validated successfully:', apiKeyDoc);
    const org = {
      orgId: apiKeyDoc.organisationId,
      orgAlias: apiKeyDoc.organisationAlias,
    };

    request.org= org;
    return org;
  }
}
