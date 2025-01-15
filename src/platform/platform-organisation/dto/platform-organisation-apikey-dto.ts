import { IsString } from 'class-validator';

export class GetPlatformOrganisationApiKeyDto {
  @IsString()
  organisationId: string;
}
