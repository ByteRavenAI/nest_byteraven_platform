import { ApiProperty } from '@nestjs/swagger';
import {
  ScreeningQuestionTypeEnum,
  SubmissionStatusEnum,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ScreeningFormSubmissionQuestionDto {
  @IsInt()
  @ApiProperty({ description: 'Index of the question' })
  index: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Agent Question' })
  agent?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Human Answer' })
  human?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Human Answer Audio URL' })
  humanAudioUrl?: string;

  @IsEnum(ScreeningQuestionTypeEnum)
  @ApiProperty({ description: 'Answer Type' })
  answerType: ScreeningQuestionTypeEnum;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Answers Given' })
  answersGiven: string[];
}

export class CreatePlatformScreeningFormSubmissionDto {
  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @IsEmail()
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'First Name' })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Last Name' })
  lastName?: string;

  @IsString()
  @ApiProperty({ description: 'Phone Number' })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ description: 'Screening Job ID' })
  screeningJobId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreeningFormSubmissionQuestionDto)
  @ApiProperty({ description: 'Chat' })
  chat: ScreeningFormSubmissionQuestionDto[];

  @IsString()
  @ApiProperty({ description: 'Created At' })
  createdAt: string;

  @IsEnum(SubmissionStatusEnum)
  @ApiProperty({ description: 'Status' })
  status: SubmissionStatusEnum;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Upvotes' })
  upvotes: string[];

  @IsBoolean()
  @ApiProperty({ description: 'Is Viewed' })
  isViewed: boolean;

  @IsBoolean()
  @ApiProperty({ description: 'Is Private' })
  isPrivate: boolean;
}

export class UpdatePlatformScreeningSubmissionStreamingWithNewMessageDto {
  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;

  @IsString()
  @ApiProperty({ description: 'Agent Question' })
  agent: string;

  @IsString()
  @ApiProperty({ description: 'Human Answer' })
  human: string;
}

export class UpdatePlatformScreeningSubmissionsStatusDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Screening Submission IDs' })
  screeningSubmissionIds: string[];

  @IsEnum(SubmissionStatusEnum)
  @ApiProperty({ description: 'Submission Status' })
  status: SubmissionStatusEnum;
}

export class UpdatePlatformScreeningSubmissionChatDto {
  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;

  @IsInt()
  @ApiProperty({ description: 'Index of the question' })
  index: number;

  @IsString()
  @ApiProperty({ description: 'Agent Question' })
  human: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Human Answer' })
  humanAudioUrl?: string;

  @IsEnum(ScreeningQuestionTypeEnum)
  @ApiProperty({ description: 'Answer Type' })
  answerType: ScreeningQuestionTypeEnum;
}

export class GetPlatformScreeningSubmissionUsingEmailOrPhoneDto {
  @IsEmail()
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Phone Number' })
  phone: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @IsString()
  @ApiProperty({ description: 'Job ID' })
  jobId: string;
}

export class GetPlatformScreeningSubmissionsUsingJobIdDto {
  @IsString()
  @ApiProperty({ description: 'Job ID' })
  jobId: string;
}

export class GetPlatformScreeningSubmissionsUsingIdDto {
  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;
}

export class UpdatePlatformScreeningSubmissionViewStatusDto {
  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;
}

export class GetPlatformScreeningSubmissionsOfOrgDto {
  @IsString()
  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @IsString()
  @ApiProperty({ description: 'Job ID' })
  jobId: string;

  @IsOptional()
  @IsEnum(SubmissionStatusEnum)
  @ApiProperty({ description: 'Submission Status' })
  status: SubmissionStatusEnum;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Start After' })
  startAfter: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'Limit' })
  limit: number;
}

export class CreatePlatformScreeningSubmissionStreamingRoomTokenDto {
  @IsString()
  @ApiProperty({ description: 'Screening Job ID' })
  screeningJobId: string;

  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;

  @IsInt()
  @ApiProperty({ description: 'Current Date Time in Epoch' })
  currDateTimeEpoch: number;
}

export class GetTextFromAudioForPlatformScreeningSubmissionAnswerDto {
  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;

  @IsInt()
  @ApiProperty({ description: 'Index of the question' })
  @Transform(({ value }) => parseInt(value, 10))
  index: number;

  @ApiProperty({
    description: 'The audio file of the answer',
    type: 'string',
    format: 'binary', // Required for file uploads in Swagger
  })
  file: any;

  @IsString()
  @ApiProperty({ description: 'File Type' })
  fileType: string;
}

// Response DTOs

export class PlatformScreeningSubmissionResponseDto {
  @IsString()
  @ApiProperty({ description: 'Screening Submission ID' })
  screeningSubmissionId: string;

  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString()
  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @IsEmail()
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'First Name' })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Last Name' })
  lastName?: string;

  @IsString()
  @ApiProperty({ description: 'Phone Number' })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ description: 'Screening Job ID' })
  screeningJobId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreeningFormSubmissionQuestionDto)
  @ApiProperty({
    description: 'Chat',
    type: [ScreeningFormSubmissionQuestionDto],
  })
  chat: ScreeningFormSubmissionQuestionDto[];

  @IsString()
  @ApiProperty({ description: 'Created At' })
  createdAt: string;

  @IsEnum(SubmissionStatusEnum)
  @ApiProperty({ description: 'Status', type: 'string' })
  status: SubmissionStatusEnum;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Upvotes' })
  upvotes: string[];

  @IsBoolean()
  @ApiProperty({ description: 'Is Viewed' })
  isViewed: boolean;

  @IsBoolean()
  @ApiProperty({ description: 'Is Private' })
  isPrivate: boolean;
}

export class PlatformScreeningSubmissionListResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformScreeningSubmissionResponseDto)
  @ApiProperty({
    description: 'Screening Submissions',
    type: [PlatformScreeningSubmissionResponseDto],
  })
  screeningSubmissions: PlatformScreeningSubmissionResponseDto[];
}

export class CreatePlatformScreeningSubmissionResponseDto {
  @ApiProperty({ description: 'Screening Submission Id' })
  screeningSubmissionId: string;
}

export class PlatformScreeningSubmissionTextFromAudioResponseDto {
  @ApiProperty({ description: 'Text from Audio' })
  data: string;

  @ApiProperty({ description: 'Audio Url' })
  answerLocation: string;
}

export class PlatformScreeningSubmissionCreateStreamRoomResponseDto {
  @ApiProperty({ description: 'Token' })
  accessToken: string;

  @ApiProperty({ description: 'Url' })
  url: string;
}
