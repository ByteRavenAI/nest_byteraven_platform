import { ScreeningQuestionTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateScreeningTemplateQuestionDto {
  @IsInt()
  index: number;

  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  questionAudioUrl?: string;

  @IsEnum(ScreeningQuestionTypeEnum)
  questionType: ScreeningQuestionTypeEnum;

  @IsArray()
  @IsString({ each: true })
  questionsOptions: string[];

  @IsArray()
  @IsString({ each: true })
  correctAnswers: string[];
}

export class CreateScreeningTemplateDto {
  @IsOptional()
  @IsString()
  screeningTemplateId?: string;

  @IsString()
  orgId: string;

  @IsString()
  orgAlias: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  prompt: string;

  @IsBoolean()
  isStreaming: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScreeningTemplateQuestionDto)
  questions: CreateScreeningTemplateQuestionDto[];

  @IsString()
  createdAt: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
