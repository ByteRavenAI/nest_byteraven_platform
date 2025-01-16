import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateScreeningJobDto {
  @IsOptional()
  @IsString()
  screeningJobId?: string;

  @IsString()
  orgId: string;

  @IsString()
  orgAlias: string;

  @IsString()
  screeningTemplateId: string;

  @IsString()
  title: string;

  @IsBoolean()
  jobActive: boolean = true;

  @IsOptional()
  @IsString()
  jd?: string;

  @IsArray()
  @IsString({ each: true })
  upvotes: string[] = [];

  @IsString()
  createdAt: string;
}

export class GetScreeningJobByIdDto {
  @IsString()
  screeningJobId: string;
}

export class ScreeningJobsByOrgIdDto {
  @IsString()
  orgId: string;
}

export class ScreeningJobResponseDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  screeningJobId?: string;

  @IsString()
  orgId: string;

  @IsString()
  orgAlias: string;

  @IsString()
  screeningTemplateId: string;

  @IsString()
  title: string;

  @IsBoolean()
  jobActive: boolean;

  @IsOptional()
  @IsString()
  jd?: string;

  @IsArray()
  @IsString({ each: true })
  upvotes: string[];

  @IsString()
  createdAt: string;
}

export class ScreeningJobListResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreeningJobResponseDto)
  screeningJobs: ScreeningJobResponseDto[];
}
