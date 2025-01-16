import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreatePlatformOrganisationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId?: string;

  @IsString({ message: 'Organization name is required' })
  @ApiProperty({ description: 'Organisation name' })
  orgName: string;

  @IsString()
  @ApiProperty({ description: 'Organisation alias' })
  orgAlias: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Organisation Dp Url' })
  orgDpUrl?: string = '';

  @IsString()
  @ApiProperty({ description: 'Organisation Super Admin Id' })
  orgSuperAdmin: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Organisation Admins' })
  orgAdmins: string[] = [];

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
  orgActive: boolean = true;

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
