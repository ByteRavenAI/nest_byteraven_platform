import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPlatformOrganisationApiKeyDto {
  @IsString()
  organisationId: string;
}

// Response DTOs

export class GetPlatformOrganisationApiKeyResponseDto {
  @IsString()
  @ApiProperty({ description: 'Api Key' })
  apiKey: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Alias' })
  organisationAlias: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Id' })
  organisationId: string;
}
