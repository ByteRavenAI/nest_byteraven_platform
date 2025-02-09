import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreatePlatformOrganisationDto {
  // @IsOptional()
  // @IsString()
  // @ApiProperty({ description: 'Organisation ID' })
  // orgId?: string;

  @IsString({ message: 'Organization name is required' })
  @ApiProperty({ description: 'Organisation name' })
  orgName: string;

  @Optional()
  @IsString()
  orgAlias: string = '';

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ description: 'Organisation Dp Url' })
  // orgDpUrl?: string = '';

  @IsString()
  @ApiProperty({ description: 'Organisation Super Admin Id' })
  orgSuperAdmin: string;

  // @IsArray()
  // @IsString({ each: true })
  // @ApiProperty({ description: 'Organisation Admins' })
  // orgAdmins: string[] = [];

  @IsString({ message: 'Organization join date is required' })
  @ApiProperty({
    description: 'Organisation Joining Date in ISO Date Time String',
  })
  orgJoinedAt: string;

  @IsString({ message: 'Organization country is required' })
  @ApiProperty({ description: 'Organisation Conuntry' })
  orgCountry: string;

  @IsString({ message: 'Organization city is required' })
  @ApiProperty({ description: 'Organisation City' })
  orgCity: string;

  @IsString({ message: 'Organization state is required' })
  @ApiProperty({ description: 'Organisation State' })
  orgState: string;

  @IsBoolean()
  @ApiProperty({ description: 'Organisation Active Status' })
  @Transform(({ value }) => value === 'true') // Convert "true"/"false" strings to boolean
  orgActive: boolean;

  @IsString({ message: 'Creation date is required' })
  @ApiProperty({
    description: 'Organisation Creation Date in ISO Date Time String',
  })
  createdAt: string;

  @IsString({ message: 'Last updated date is required' })
  @ApiProperty({
    description: 'Organisation Last Updated Date in ISO Date Time String',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'The logo file of the organisation',
    type: 'string',
    format: 'binary', // Required for file uploads in Swagger
  })
  file: any;
}

export class GetPlatformOrganisationViaIdDto {
  @IsString({ message: 'Organization ID is required' })
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;
}

export class GetPlatformUserViaAdminIdDto {
  @IsString({ message: 'Admin ID is required' })
  @ApiProperty({ description: 'Admin ID' })
  adminId: string;
}

// Response DTOs

export class PlatformOrganisationResponseDto {
  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString()
  @ApiProperty({ description: 'Organisation name' })
  orgName: string;

  @IsString()
  @ApiProperty({ description: 'Organisation alias' })
  orgAlias: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Dp Url' })
  orgDpUrl: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Super Admin Id' })
  orgSuperAdmin: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Organisation Admins' })
  orgAdmins: string[];

  @IsString()
  @ApiProperty({ description: 'Organisation Joining Date' })
  orgJoinedAt: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Country' })
  orgCountry: string;

  @IsString()
  @ApiProperty({ description: 'Organisation City' })
  orgCity: string;

  @IsString()
  @ApiProperty({ description: 'Organisation State' })
  orgState: string;

  @IsBoolean()
  @ApiProperty({ description: 'Organisation Active Status' })
  orgActive: boolean;

  @IsString()
  @ApiProperty({ description: 'Creation date in ISO Date Time String' })
  createdAt: string;

  @IsString()
  @ApiProperty({ description: 'Last Updated date in ISO Date Time String' })
  updatedAt: string;
}

export class PlatformOrganisationsListResponseDto {
  @IsArray()
  @ApiProperty({ description: 'List of Organisations' })
  organisations: PlatformOrganisationResponseDto[];
}
