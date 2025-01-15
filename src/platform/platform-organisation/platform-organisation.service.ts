import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformOrganisationDto,
  GetPlatformOrganisationViaIdDto,
  GetPlatformUserViaAdminIdDto,
} from './dto/platform-organisation-dto';
import { GetPlatformOrganisationApiKeyDto } from './dto/platform-organisation-apikey-dto';

@Injectable()
export class PlatformOrganisationService {
  constructor(private prisma: PrismaService) {}
  async createOrganisation(dto: CreatePlatformOrganisationDto) {
    try {
      return this.prisma.organisation.create({
        data: {
          orgId: dto.orgId,
          orgName: dto.orgName,
          orgAlias: dto.orgAlias,
          orgDpUrl: dto.orgDpUrl,
          orgSuperAdmin: dto.orgSuperAdmin,

          orgAdmins: dto.orgAdmins,
          orgJoinedAt: dto.orgJoinedAt,
          orgCountry: dto.orgCountry,
          orgCity: dto.orgCity,
          orgState: dto.orgState,
          orgActive: dto.orgActive,

          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
        },
      });
    } catch (error) {
      throw new Error('Unable to create organisation');
    }
  }

  async getOrganisationById(query: GetPlatformOrganisationViaIdDto) {
    try {
      const org = await this.prisma.organisation.findUnique({
        where: { id: query.orgId },
      });

      if (!org) {
        throw new NotFoundException(
          'No organisation found with the provided id',
        );
      }

      return {
        orgId: org.id,
        ...org,
      };
    } catch (error) {
      throw new Error('Unable to find organisation');
    }
  }

  async getOrganisationsByAdminId(query: GetPlatformUserViaAdminIdDto) {
    try {
      const orgs = await this.prisma.organisation.findMany({
        where: {
          OR: [
            { orgSuperAdmin: query.adminId },
            { orgAdmins: { has: query.adminId } },
          ],
        },
      });

      if (!orgs) {
        throw new NotFoundException(
          'No organisation found with the provided admin id',
        );
      }

      for (let i = 0; i < orgs.length; i++) {
        orgs[i] = {
          orgId: orgs[i].id,
          ...orgs[i],
        };
      }
      return orgs;
    } catch (error) {
      throw new Error('Unable to find organisation');
    }
  }

  // get the api key for the organisation if organisation exists

  async getOrganisationApiKey(query: GetPlatformOrganisationApiKeyDto) {
    try {
      const org = await this.prisma.organisation.findUnique({
        where: { id: query.organisationId },
      });

      if (!org) {
        throw new NotFoundException(
          'No organisation found with the provided id',
        );
      }

      const orgApiKey = await this.prisma.organisationApiKey.findUnique({
        where: { organisationId: query.organisationId },
      });

      if (!orgApiKey) {
        throw new NotFoundException(
          'No api key found for the provided organisation id',
        );
      }

      return orgApiKey;
    } catch (error) {
      throw new Error('Unable to find organisation');
    }
  }
}
