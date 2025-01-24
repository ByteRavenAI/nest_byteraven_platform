import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { GetPlatformOrganisationApiKeyResponseDto } from 'src/platform/platform-organisation/dto/platform-organisation-apikey-dto';
import {
  CreatePlatformOrganisationBillingStripeSessionResponseDto,
  GetOrganisationBillingViaOrgIdResponseDto,
} from 'src/platform/platform-organisation/dto/platform-organisation-billing-dto';
import {
  PlatformOrganisationResponseDto,
  PlatformOrganisationsListResponseDto,
} from 'src/platform/platform-organisation/dto/platform-organisation-dto';
import {
  GetAllOrganisationMemberStatusOfOrgListResponseDto,
  GetOrganisationMemberStatusResponseDto,
} from 'src/platform/platform-organisation/dto/platform-organisation-member-dto';
import {
  PlatformScreeningJobListResponseDto,
  PlatformScreeningJobResponseDto,
} from 'src/platform/platform-screening/platform-screening-jobs/dto/platform-screening-job-dto';
import {
  CreatePlatformScreeningSubmissionResponseDto,
  PlatformScreeningSubmissionCreateStreamRoomResponseDto,
  PlatformScreeningSubmissionListResponseDto,
  PlatformScreeningSubmissionResponseDto,
  PlatformScreeningSubmissionTextFromAudioResponseDto,
} from 'src/platform/platform-screening/platform-screening-submissions/dto/platform-screening-submission-dto';
import { GetAllPlatformScreeningTemplatesOfOrgResponseDto } from 'src/platform/platform-screening/platform-screening-templates/dto/platform-screening-template-dto';
import {
  PlatformUserJwtResponseDto,
  PlatformUserResponseDto,
} from 'src/platform/platform-user/dto';

// Register all possible DTOs that T can represent
@ApiExtraModels(
  PlatformScreeningSubmissionCreateStreamRoomResponseDto,

  PlatformScreeningSubmissionTextFromAudioResponseDto,
  PlatformScreeningSubmissionResponseDto,
  PlatformScreeningSubmissionListResponseDto,
  CreatePlatformScreeningSubmissionResponseDto,
  GetAllPlatformScreeningTemplatesOfOrgResponseDto,
  PlatformScreeningJobResponseDto,
  PlatformScreeningJobListResponseDto,
  PlatformUserResponseDto,
  PlatformUserJwtResponseDto,
  PlatformOrganisationResponseDto,
  PlatformOrganisationsListResponseDto,
  GetPlatformOrganisationApiKeyResponseDto,
  GetOrganisationBillingViaOrgIdResponseDto,
  CreatePlatformOrganisationBillingStripeSessionResponseDto,
  GetOrganisationMemberStatusResponseDto,
  GetAllOrganisationMemberStatusOfOrgListResponseDto,
)
export class ApiResponseWrapper<T> {
  constructor(status: number, description: string, data: T) {
    this.status = status;
    this.description = description;
    this.data = data;
  }

  @ApiProperty({ description: 'HTTP status code', example: 200 })
  status: number;

  @ApiProperty({
    description: 'Description of the response',
    example: 'Screening Submission Streaming Room Created',
  })
  description: string;

  @ApiProperty({
    description: 'Actual response data',
    oneOf: [
      {
        $ref: getSchemaPath(
          PlatformScreeningSubmissionCreateStreamRoomResponseDto,
        ),
      },
      {
        $ref: getSchemaPath(
          PlatformScreeningSubmissionTextFromAudioResponseDto,
        ),
      },
      {
        $ref: getSchemaPath(PlatformScreeningSubmissionResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformScreeningSubmissionListResponseDto),
      },
      {
        $ref: getSchemaPath(CreatePlatformScreeningSubmissionResponseDto),
      },
      {
        $ref: getSchemaPath(GetAllPlatformScreeningTemplatesOfOrgResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformScreeningJobResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformScreeningJobListResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformUserResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformUserJwtResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformOrganisationResponseDto),
      },
      {
        $ref: getSchemaPath(PlatformOrganisationsListResponseDto),
      },
      {
        $ref: getSchemaPath(GetPlatformOrganisationApiKeyResponseDto),
      },
      {
        $ref: getSchemaPath(GetOrganisationBillingViaOrgIdResponseDto),
      },
      {
        $ref: getSchemaPath(
          CreatePlatformOrganisationBillingStripeSessionResponseDto,
        ),
      },
      {
        $ref: getSchemaPath(GetOrganisationMemberStatusResponseDto),
      },
      {
        $ref: getSchemaPath(GetAllOrganisationMemberStatusOfOrgListResponseDto),
      },
    ],
  })
  data: T;
}
