import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PlatformCreateScreeningJobDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Screening Job Id' })
  screeningJobId?: string;

  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString()
  @ApiProperty({ description: 'Organisation alias' })
  orgAlias: string;

  @IsString()
  @ApiProperty({ description: 'Screening Template ID' })
  screeningTemplateId: string;

  @IsString()
  @ApiProperty({ description: 'Screening Job Title' })
  title: string;

  @IsBoolean()
  @ApiProperty({ description: 'Screening Job Active Status' })
  jobActive: boolean = true;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Screening Job JD' })
  jd?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Screening Job Upvotes' })
  upvotes: string[] = [];

  @IsString()
  @ApiProperty({ description: 'Creation date in ISO Date Time String' })
  createdAt: string;
}

export class PlatformGetScreeningJobByIdDto {
  @IsString()
  @ApiProperty({ description: 'Screening Job Id' })
  screeningJobId: string;
}

// Response DTOs

export class PlatformScreeningJobResponseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Screening Job Id' })
  screeningJobId?: string;

  @IsString()
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString()
  @ApiProperty({ description: 'Organisation alias' })
  orgAlias: string;

  @IsString()
  @ApiProperty({ description: 'Screening Template ID' })
  screeningTemplateId: string;

  @IsString()
  @ApiProperty({ description: 'Screening Job Title' })
  title: string;

  @IsBoolean()
  @ApiProperty({ description: 'Screening Job Active Status' })
  jobActive: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Screening Job JD' })
  jd?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Upvoted By' })
  upvotes: string[];

  @IsString()
  @ApiProperty({ description: 'Creation date in ISO Date Time String' })
  createdAt: string;
}

export class PlatformScreeningJobListResponseDto {
  @IsArray()
  @ApiProperty({ description: 'List of Screening Jobs' })
  @ValidateNested({ each: true })
  @Type(() => PlatformScreeningJobResponseDto)
  screeningJobs: PlatformScreeningJobResponseDto[];
}
