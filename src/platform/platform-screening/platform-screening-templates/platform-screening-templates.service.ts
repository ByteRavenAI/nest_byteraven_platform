import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateScreeningTemplateDto,
  CreateScreeningTemplateQuestionDto,
  GetAllPlatformScreeningTemplatesOfOrgResponseDto,
} from './dto/platform-screening-template-dto';
import { v4 as uuidv4 } from 'uuid';
import { LlmService } from 'src/llm/llm.service';
import { AwsService } from 'src/aws/aws.service';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class PlatformScreeningTemplatesService {
  constructor(
    private prisma: PrismaService,
    private llmService: LlmService,
    private awsService: AwsService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {}

  async createScreeningTemplate(
    orgId: string,
    orgAlias: string,
    dto: CreateScreeningTemplateDto,
  ): Promise<boolean> {
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

          const uniqueFileName = `organisations/${orgId}/screeningtemplatequestions/${audioFileName}`;

          // create file from path audio
          const file: Express.Multer.File = {
            fieldname: 'audio',
            originalname: `${uuidv4()}.mp3`,
            encoding: '7bit',
            mimetype: 'audio/mpeg',
            buffer: Buffer.from(audio, 'binary'),
            size: Buffer.byteLength(audio, 'binary'),
            stream: new Readable(),
            destination: '',
            filename: '',
            path: '',
          };

          const audioUrl = await this.awsService.uploadFileToS3Service(
            this.config.get('AWS_S3_BUCKET_NAME') || '',
            file,

            uniqueFileName,
          );

          if (audioUrl) {
            questions[i]['questionAudioUrl'] = audioUrl.url || '';
          }

          // TODO
          //   deleteFileService(audio ?? '');
        }
      }

      const result = await this.prisma.screeningTemplate.create({
        data: {
          orgId: orgId,
          orgAlias: orgAlias,
          title: dto.title,
          questions: dto.questions,
          description: dto.description,
          prompt: dto.prompt,
          isStreaming: dto.isStreaming,
          createdAt: dto.createdAt,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(
        `Unable to create screening template: ${error}`,
        error.stack,
        'PlatformScreeningTemplatesService/createScreeningTemplate',
      );
      throw new Error('Unable to create screening template');
    }
  }

  async getScreeningTemplatesOfOrg(
    orgId: string,
  ): Promise<GetAllPlatformScreeningTemplatesOfOrgResponseDto> {
    try {
      const screeningTemplates = await this.prisma.screeningTemplate.findMany({
        where: { orgId: orgId },
      });

      for (let i = 0; i < screeningTemplates.length; i++) {
        screeningTemplates[i] = {
          screeningTemplateId: screeningTemplates[i].id,
          ...screeningTemplates[i],
        };
      }

      return {
        screeningTemplates: screeningTemplates,
      };
    } catch (error) {
      this.logger.error(
        `Unable to get screening templates of org: ${error}`,
        error.stack,
        'PlatformScreeningTemplatesService/getScreeningTemplatesOfOrg',
      );
      return { screeningTemplates: [] };
    }
  }

  async generateScreeningTemplateQuestions(
    jobTitle: string,
  ): Promise<string[]> {
    try {
      const questions =
        await this.llmService.generateScreeningTemplateQuestionsService(
          jobTitle,
        );
      return questions;
    } catch (error) {
      this.logger.error(
        `Unable to generate screening template questions: ${error}`,
        error.stack,
        'PlatformScreeningTemplatesService/generateScreeningTemplateQuestions',
      );
      return [];
    }
  }
}
