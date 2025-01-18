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