import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformOrganisationDto,
  GetPlatformOrganisationViaIdDto,
  GetPlatformUserViaAdminIdDto,
  PlatformOrganisationResponseDto,
  PlatformOrganisationsListResponseDto,
} from './dto/platform-organisation-dto';
import { GetPlatformOrganisationApiKeyDto } from './dto/platform-organisation-apikey-dto';
import {
  CreateOrganisationBillingStripePaymentSessionDto,
  CreatePlatformOrganisationBillingStripeSessionResponseDto,
  GetOrganisationBillingViaOrgIdResponseDto,
} from './dto/platform-organisation-billing-dto';
import { StripeService } from 'src/stripe/stripe.service';
import {
  OrganisationMemberStatusEnum,
  OrganisationTransaction,
  OrganisationUsage,
} from '@prisma/client';
import {
  CreateOrganisationMemberStatusDto,
  GetAllOrganisationMemberStatusOfOrgListResponseDto,
  GetOrganisationMemberStatusOfUser,
  GetOrganisationMemberStatusResponseDto,
  UpdateOrganisationMemberStatusDto,
} from './dto/platform-organisation-member-dto';

@Injectable()
export class PlatformOrganisationService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private readonly logger: Logger,
  ) {}
  async createOrganisation(
    dto: CreatePlatformOrganisationDto,
  ): Promise<boolean> {
    // TODO - create api key and billing object
    try {
      const success = this.prisma.organisation.create({
        data: dto,
      });
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Unable to create organisation: ${error}`,
        error.stack,
        'PlatformOrganisationService/createOrganisation',
      );
      throw new Error('Unable to create organisation');
    }
  }

  async getOrganisationById(
    query: GetPlatformOrganisationViaIdDto,
  ): Promise<PlatformOrganisationResponseDto> {
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
      this.logger.error(
        `Unable to find organisation: ${error}`,
        error.stack,
        'PlatformOrganisationService/getOrganisationById',
      );
      throw new Error('Unable to find organisation');
    }
  }

  async getOrganisationsByAdminId(
    query: GetPlatformUserViaAdminIdDto,
  ): Promise<PlatformOrganisationsListResponseDto> {
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
      return {
        organisations: orgs,
      };
    } catch (error) {
      this.logger.error(
        `Unable to find organisations: ${error}`,
        error.stack,
        'PlatformOrganisationService/getOrganisationsByAdminId',
      );
      throw new Error('Unable to find organisation');
    }
  }

  // get the api key for the organisation if organisation exists

  async getOrganisationApiKey(orgId: string) {
    try {
      const org = await this.prisma.organisation.findUnique({
        where: { id: orgId },
      });

      if (!org) {
        throw new NotFoundException(
          'No organisation found with the provided id',
        );
      }

      const orgApiKey = await this.prisma.organisationApiKey.findUnique({
        where: { organisationId: orgId },
      });

      if (!orgApiKey) {
        throw new NotFoundException(
          'No api key found for the provided organisation id',
        );
      }

      return orgApiKey;
    } catch (error) {
      this.logger.error(
        `Unable to find organisation: ${error}`,
        error.stack,
        'PlatformOrganisationService/getOrganisationApiKey',
      );
      throw new Error('Unable to find organisation');
    }
  }

  async getOrganisationBilling(
    orgId: string,
  ): Promise<GetOrganisationBillingViaOrgIdResponseDto> {
    try {
      const org = await this.prisma.organisationBilling.findUnique({
        where: { orgId: orgId },
      });

      if (!org) {
        throw new NotFoundException(
          'No organisation found with the provided id',
        );
      }

      return org;
    } catch (error) {
      this.logger.error(
        `Unable to find organisation billing: ${error}`,
        error.stack,
        'PlatformOrganisationService/getOrganisationBilling',
      );
      throw new Error('Unable to find organisation');
    }
  }

  async createOrganisationBillingStripePaymentSession(
    dto: CreateOrganisationBillingStripePaymentSessionDto,
  ): Promise<CreatePlatformOrganisationBillingStripeSessionResponseDto> {
    try {
      const customerId: string | null =
        await this.stripeService.createOrGetCustomerStripeService(
          dto.email,
          dto.name,
        );

      if (customerId) {
        const stripePaymentSessionId: string | null =
          await this.stripeService.createOrganisationBillingStripePaymentSessionService(
            dto.dollarAmount,
            dto.orgId,
            customerId,
            'byteraven-organisation-billing',
          );

        if (stripePaymentSessionId) {
          return {
            message: 'Payment Session created successfully',
            stripePaymentSessionId: stripePaymentSessionId,
          };
        } else {
          this.logger.error(
            `Payment Session creation failed`,
            'PlatformOrganisationService/createOrganisationBillingStripePaymentSession',
          );
          throw new Error('Payment Session creation failed');
        }
      } else {
        this.logger.error(
          `Customer creation failed`,
          'PlatformOrganisationService/createOrganisationBillingStripePaymentSession',
        );
        throw new Error('Customer creation failed');
      }
    } catch (error) {
      this.logger.error(
        `Unable to create organisation billing stripe payment session: ${error}`,
        error.stack,
        'PlatformOrganisationService/createOrganisationBillingStripePaymentSession',
      );
      throw new Error('Internal server error');
    }
  }

  async createOrganisationBillingPaymentSessionTransactionWebhookHandler(
    dto: any,
  ) {
    try {
      if (dto.object.object == 'checkout.session') {
        const metadata = dto.object.metadata;

        if (metadata.type !== 'byteraven-organisation-billing') {
          return {
            message: 'Invalid metadata type',
          };
        } else {
          const amount = dto.object.amount_total / 100;
          const orgId = metadata.orgId;
          const transactionId = dto.object.id;
          const paymentMethod = 'card';
          const status = dto.object.status;

          if (status == 'complete') {
            // update organisation billing balance
            // add transaction in organisation billing

            const updated: boolean =
              await this.updateOrganisationBillingBalance(orgId, amount);

            const addTransaction: boolean =
              await this.createOrganisationBillingTransaction(orgId, {
                transactionId: transactionId,
                amount: amount,
                paymentMethod: paymentMethod,
                currency: dto.object.currency,
                createdAt: new Date(dto.object.created * 1000).toISOString(),
              });

            if (updated && addTransaction) {
              return {
                message: 'OK',
              };
            } else {
              return {
                message: 'Internal server error',
              };
            }
          } else {
            return {
              message: 'OK',
            };
          }
        }
      } else {
        return {
          message: 'Invalid object type',
        };
      }
    } catch (error) {
      this.logger.error(
        `Unable to create organisation billing stripe payment session transaction webhook handler: ${error}`,
        error.stack,
        'PlatformOrganisationService/createOrganisationBillingPaymentSessionTransactionWebhookHandler',
      );
      throw new Error('Internal server error ' + error);
    }
  }

  async updateOrganisationBillingBalance(orgId: string, balance: number) {
    try {
      const org = await this.prisma.organisationBilling.findUnique({
        where: { orgId: orgId },
      });

      if (!org) {
        throw new NotFoundException(
          'No organisation found with the provided id',
        );
      }

      const updatedBalance = org.balance + balance;

      const updatedOrganisationBilling =
        await this.prisma.organisationBilling.update({
          where: {
            orgId: orgId,
          },
          data: {
            balance: updatedBalance,
          },
        });

      return updatedOrganisationBilling ? true : false;
    } catch (error) {
      this.logger.error(
        `Unable to update organisation billing balance: ${error}`,
        error.stack,
        'PlatformOrganisationService/updateOrganisationBillingBalance',
      );
      throw new Error('Unable to update organisation billing balance');
    }
  }

  async createOrganisationBillingUsage(
    orgId: string,
    organisationBillingId: string,
    usage: OrganisationUsage,
  ): Promise<boolean> {
    try {
      const updatedOrganisationBilling =
        await this.prisma.organisationBilling.update({
          where: {
            id: organisationBillingId,
            orgId: orgId,
          },
          data: {
            usage: {
              push: usage,
            },
          },
        });

      return updatedOrganisationBilling ? true : false;
    } catch (error) {
      this.logger.error(
        `Unable to create organisation billing usage: ${error}`,
        error.stack,
        'PlatformOrganisationService/createOrganisationBillingUsage',
      );
      return false;
    }
  }

  async createOrganisationBillingTransaction(
    orgId: string,
    transaction: OrganisationTransaction,
  ): Promise<boolean> {
    try {
      const updatedOrganisationBilling =
        await this.prisma.organisationBilling.update({
          where: {
            orgId: orgId,
          },
          data: {
            transactions: {
              push: transaction,
            },
          },
        });

      return updatedOrganisationBilling ? true : false;
    } catch (error) {
      this.logger.error(
        `Unable to create organisation billing transaction: ${error}`,
        error.stack,
        'PlatformOrganisationService/createOrganisationBillingTransaction',
      );
      return false;
    }
  }

  async createOrganisationMemberStatus(
    dto: CreateOrganisationMemberStatusDto,
  ): Promise<boolean> {
    try {
      const response = await this.prisma.organisationMemberStatus.create({
        data: dto,
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Unable to create organisation member status: ${error}`,
        error.stack,
        'PlatformOrganisationService/createOrganisationMemberStatus',
      );
      throw new Error('Unable to create organisation member status');
    }
  }

  async getOrganisationMemberStatusOfaUser(
    dto: GetOrganisationMemberStatusOfUser,
  ): Promise<GetOrganisationMemberStatusResponseDto> {
    try {
      const result = await this.prisma.organisationMemberStatus.findFirst({
        where: {
          orgId: dto.orgId,
          platformUserId: dto.platformUserId,
        },
      });

      if (result) {
        return result;
      } else {
        throw new NotFoundException('Organisation Member Status not found');
      }
    } catch (error) {
      this.logger.error(
        `Unable to find organisation member status: ${error}`,
        error.stack,
        'PlatformOrganisationService/getOrganisationMemberStatusOfaUser',
      );
      throw new Error('Unable to find organisation member status');
    }
  }

  async getAllOrganisationMemberStatus(
    orgId: string,
  ): Promise<GetAllOrganisationMemberStatusOfOrgListResponseDto> {
    try {
      // TODO Get Super Admins and Admins both
      const result = await this.prisma.organisationMemberStatus.findMany({
        where: {
          orgId: orgId,
        },
      });

      if (result) {
        const statuses = result.map((status) => {
          return {
            orgMemberStatusId: status.organisationMemberStatusId,
            status: status.status.toString(),
            ...status,
          };
        });

        return {
          data: statuses,
        };
      } else {
        throw new NotFoundException('Organisation Member Status not found');
      }
    } catch (error) {
      this.logger.error(
        `Unable to find organisation member status: ${error}`,
        error.stack,
        'PlatformOrganisationService/getAllOrganisationMemberStatus ',
      );
      throw new Error('Unable to find organisation member status');
    }
  }
  async updateOrganisationMemberStatus(
    dto: UpdateOrganisationMemberStatusDto,
  ): Promise<boolean> {
    try {
      const orgMemberStatus: any =
        await this.prisma.organisationMemberStatus.findFirst({
          where: {
            organisationMemberStatusId: dto.orgMemberStatusId,
          },
        });

      if (orgMemberStatus) {
        const result = await this.prisma.organisationMemberStatus.update({
          where: {
            organisationMemberStatusId: dto.orgMemberStatusId,
          },
          data: {
            status: dto.status,
          },
        });
        if (result) {
          const organisation = await this.prisma.organisation.findUnique({
            where: { id: orgMemberStatus.orgId },
          });

          if (dto.status == OrganisationMemberStatusEnum.accepted) {
            const changed = await this.prisma.organisation.update({
              where: { id: orgMemberStatus.orgId },
              data: {
                orgAdmins: {
                  push: orgMemberStatus.platformUserId,
                },
              },
            });
          } else if (dto.status == OrganisationMemberStatusEnum.rejected) {
            const updatedOrgAdmins = organisation.orgAdmins.filter(
              (adminId) => adminId !== orgMemberStatus.platformUserId,
            );

            const changed: any = await this.prisma.organisation.update({
              where: { id: orgMemberStatus.orgId },
              data: {
                orgAdmins: {
                  set: updatedOrgAdmins,
                },
              },
            });
          }
          return true;
        } else {
          this.logger.error(
            `Error updating Organisation Member Status`,
            'PlatformOrganisationService/updateOrganisationMemberStatus',
          );
          throw new Error('Error updating Organisation Member Status');
        }
      }
    } catch (error) {
      this.logger.error(
        `Unable to update organisation member status: ${error}`,
        error.stack,
        'PlatformOrganisationService/updateOrganisationMemberStatus',
      );
      throw new Error('Unable to update organisation member status');
    }
  }
}
