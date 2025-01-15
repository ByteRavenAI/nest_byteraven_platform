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
  orgId?: string;

  @IsString({ message: 'Organization name is required' })
  orgName: string;

  @IsString()
  orgAlias: string = '';

  @IsOptional()
  @IsString()
  orgDpUrl?: string = '';

  @IsString()
  orgSuperAdmin: string;

  @IsArray()
  @IsString({ each: true })
  orgAdmins: string[] = [];

  @IsString({ message: 'Organization join date is required' })
  orgJoinedAt: string;

  @IsString({ message: 'Organization country is required' })
  orgCountry: string;

  @IsString({ message: 'Organization city is required' })
  orgCity: string;

  @IsString({ message: 'Organization state is required' })
  orgState: string;

  @IsBoolean()
  orgActive: boolean = true;

  @IsString({ message: 'Creation date is required' })
  createdAt: string;

  @IsString({ message: 'Last updated date is required' })
  updatedAt: string;
}

export class GetPlatformOrganisationViaIdDto {
  @IsString({ message: 'Organization ID is required' })
  orgId: string;
}

export class GetPlatformUserViaAdminIdDto {
  @IsString({ message: 'Admin ID is required' })
  adminId: string;
}
