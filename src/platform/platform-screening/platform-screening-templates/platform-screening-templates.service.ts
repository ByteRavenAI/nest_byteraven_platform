import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateScreeningTemplateDto,
  CreateScreeningTemplateQuestionDto,
} from './dto/platform-screening-template-dto';
import { v4 as uuidv4 } from 'uuid';
import { LlmService } from 'src/llm/llm.service';
import { AwsService } from 'src/aws/aws.service';

import { config } from 'process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlatformScreeningTemplatesService {
  constructor(
    private prisma: PrismaService,
    private llmService: LlmService,
    private awsService: AwsService,
    private config: ConfigService,
  ) {}

  async createScreeningTemplate(dto: CreateScreeningTemplateDto) {
    try {
      // get all the questions
      const questions = dto.questions;

      // generate audio from them & save them in the cloud
      for (let i = 0; i < questions.length; i++) {
        const audio =
          await this.llmService.generateAudioFromTextUsingEllevenLabsService(
            questions[i].question,
          );

        if (audio != null) {
          const audioFileName = `${uuidv4()}.mp3`;

          const uniqueFileName = `organisations/${dto.orgId}/screeningtemplatequestions/${audioFileName}`;

          const audioUrl = await this.awsService.uploadFileToS3Service(
            this.config.get('AWS_BUCKET_NAME') || '',
            audio,
            uniqueFileName,
          );

          if (audioUrl) {
            questions[i].questionAudioUrl = audioUrl.url || '';
          }

          // TODO
          //   deleteFileService(audio ?? '');
        }
      }

      const result = await this.prisma.screeningTemplate.create({
        data: dto,
      });

      return {
        success: true,
        message: 'Screening Template created successfully',
      };
    } catch (error) {
      throw new Error('Unable to create screening template');
    }
  }

  async getScreeningTemplatesOfOrg(orgId: string) {
    const screeningTemplates = await this.prisma.screeningTemplate.findMany({
      where: { orgId: orgId },
    });

    for (let i = 0; i < screeningTemplates.length; i++) {
      screeningTemplates[i] = {
        screeningTemplateId: screeningTemplates[i].id,
        ...screeningTemplates[i],
      };
    }

    return screeningTemplates;
  }

  async generateScreeningTemplateQuestions(
    jobTitle: string,
  ): Promise<string[]> {
    const questions =
      await this.llmService.generateScreeningTemplateQuestionsService(jobTitle);
    return questions;
  }
}
