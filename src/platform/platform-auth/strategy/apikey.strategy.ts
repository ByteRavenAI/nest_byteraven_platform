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
    try {
      const apiKey = req.headers['x-api-key'] as string;

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

      return {
        orgId: apiKeyDoc.organisationId,
        orgAlias: apiKeyDoc.organisationAlias,
      };
    } catch (error) {
      console.error('Error during API key validation:', error);
      throw new UnauthorizedException('API key validation failed');
    }
  }
}
