import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrganisationBillingStripePaymentSessionDto {
  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsNumber()
  @ApiProperty({ description: 'Dollar Amount' })
  dollarAmount: number;

  @IsString()
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Name' })
  name: string;
}

export class GetOrganisationBillingViaOrgIdDto {
  @IsString({ message: 'Organisation ID is required' })
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;
}

// Response DTOs

export class GetOrganisationBillingViaOrgIdResponseDto {
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @ApiProperty({ description: 'Organisation Super Admin ID' })
  orgSuperAdminId: string;

  @ApiProperty({ description: 'Balance' })
  balance: number;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiProperty({ description: 'Usage' })
  usage: OrganisationBillingUsageResponseDto[];

  @ApiProperty({ description: 'Transactions' })
  transactions: OrganisationBillingTransactionResponseDto[];

  @ApiProperty({ description: 'Last Updated' })
  lastUpdated: string;
}

export class OrganisationBillingTransactionResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Amount' })
  amount: number;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiProperty({ description: 'Created At' })
  createdAt: string;

  @ApiProperty({ description: 'Payment Method' })
  paymentMethod: string;
}

export class OrganisationBillingUsageResponseDto {
  @ApiProperty({ description: 'Usage Type' })
  usageType: string;

  @ApiProperty({ description: 'Usage ID' })
  usageId: string;

  @ApiProperty({ description: 'Created At' })
  createdAt: string;
}

export class CreatePlatformOrganisationBillingStripeSessionResponseDto {
  @ApiProperty({ description: 'Message' })
  message: string;

  @ApiProperty({ description: 'Stripe Payment Session ID' })
  stripePaymentSessionId: string;
}
