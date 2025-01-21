import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Question Index' })
  index: number;

  @IsString()
  @ApiProperty({ description: 'Question' })
  question: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({ description: 'Question Audio URL' })
  // questionAudioUrl?: string;

  @IsEnum(ScreeningQuestionTypeEnum)
  @ApiProperty({ description: 'Question Type' })
  questionType: ScreeningQuestionTypeEnum;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Question Options' })
  questionsOptions: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Correct Answers' })
  correctAnswers: string[];
}

export class CreateScreeningTemplateDto {

  @IsString()
  @ApiProperty({ description: 'Template Title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'Template Description' })
  description: string;

  @IsString()
  @ApiProperty({ description: 'Template Prompt' })
  prompt: string;

  @IsBoolean()
  @ApiProperty({ description: 'Is the Template Streaming (Real Time)' })
  isStreaming: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScreeningTemplateQuestionDto)
  @ApiProperty({ description: 'Template Questions' })
  questions: CreateScreeningTemplateQuestionDto[];

  @IsString()
  @ApiProperty({ description: 'Created At' })
  createdAt: string;

  // @IsOptional()
  // metadata?: Record<string, any>;
}

export class GenerateScreeningTemplateQuestionsDto {
  @IsString()
  @ApiProperty({ description: 'Task Title' })
  jobTitle: string;
}

// Response DTOs

export class CreatePlatformScreeningTemplateResponseDto {
  @ApiProperty({ description: 'Response Message' })
  message: string;

  @ApiProperty({ description: 'Success' })
  success: boolean;
}

export class GetAllPlatformScreeningTemplatesOfOrgResponseDto {
  @ApiProperty({ description: 'Screening Templates' })
  screeningTemplates: CreateScreeningTemplateDto[];
}

export class GenerateScreeningTemplateQuestionsResponseDto {
  @ApiProperty({ description: 'Screening Template Questions' })
  questions: string[];
}
