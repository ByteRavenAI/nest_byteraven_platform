import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlatformOrgApiKeyStrategy extends PassportStrategy(
  Strategy,
  'platform-org-api-key',
) {
  constructor(private prisma: PrismaService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const apiKeyDoc = await this.prisma.organisationApiKey.findUnique({
      where: {
        apiKey,
      },
    });

    if (!apiKeyDoc) {
      throw new UnauthorizedException('Invalid API key');
    }

    return {
      orgId: apiKeyDoc.organisationId,
      orgAlias: apiKeyDoc.organisationAlias,
    };
  }
}
