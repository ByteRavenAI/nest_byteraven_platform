import { ApiProperty } from '@nestjs/swagger';
import {
  ScreeningQuestionTypeEnum,
  SubmissionStatusEnum,
} from '@prisma/client';
import { Type } from 'class-transformer';
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
  index: number;

  @IsOptional()
  @IsString()
  agent?: string;

  @IsOptional()
  @IsString()
  human?: string;

  @IsOptional()
  @IsString()
  humanAudioUrl?: string;

  @IsEnum(ScreeningQuestionTypeEnum)
  answerType: ScreeningQuestionTypeEnum;

  @IsArray()
  @IsString({ each: true })
  answersGiven: string[];
}

export class CreatePlatformScreeningFormSubmissionDto {
  @IsOptional()
  @IsString()
  screeningFormSubmissionId?: string;

  @IsString()
  orgId: string;

  @IsString()
  orgAlias: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  screeningJobId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreeningFormSubmissionQuestionDto)
  chat: ScreeningFormSubmissionQuestionDto[];

  @IsString()
  createdAt: string;

  @IsEnum(SubmissionStatusEnum)
  status: SubmissionStatusEnum;

  @IsArray()
  @IsString({ each: true })
  upvotes: string[];

  @IsBoolean()
  isViewed: boolean;

  @IsBoolean()
  isPrivate: boolean;
}

export class UpdatePlatformScreeningSubmissionStreamingWithNewMessageDto {
  @IsString()
  screeningSubmissionId: string;

  @IsString()
  agent: string;

  @IsString()
  human: string;
}

export class UpdatePlatformScreeningSubmissionsStatusDto {
  @IsArray()
  @IsString({ each: true })
  screeningSubmissionIds: string[];

  @IsEnum(SubmissionStatusEnum)
  status: SubmissionStatusEnum;
}

export class UpdatePlatformScreeningSubmissionChatDto {
  @IsString()
  screeningSubmissionId: string;

  @IsInt()
  index: number;

  @IsString()
  human: string;

  @IsOptional()
  @IsString()
  humanAudioUrl?: string;

  @IsEnum(ScreeningQuestionTypeEnum)
  answerType: ScreeningQuestionTypeEnum;
}

export class GetPlatformScreeningSubmissionUsingEmailOrPhoneDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  orgAlias: string;

  @IsString()
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
  index: number;

  @IsString()
  @ApiProperty({ description: 'File Type' })
  fileType: string;
}
