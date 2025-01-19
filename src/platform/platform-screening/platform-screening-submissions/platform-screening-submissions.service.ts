import { Injectable, Logger } from '@nestjs/common';
import { SubmissionStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformScreeningFormSubmissionDto,
  CreatePlatformScreeningSubmissionResponseDto,
  GetPlatformScreeningSubmissionsOfOrgDto,
  GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  PlatformScreeningSubmissionCreateStreamRoomResponseDto,
  PlatformScreeningSubmissionListResponseDto,
  PlatformScreeningSubmissionResponseDto,
  PlatformScreeningSubmissionTextFromAudioResponseDto,
  UpdatePlatformScreeningSubmissionChatDto,
} from './dto/platform-screening-submission-dto';

import { v4 as uuidv4 } from 'uuid';
import { LivekitService } from 'src/livekit/livekit.service';
import { ConfigService } from '@nestjs/config';
import { LlmService } from 'src/llm/llm.service';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PlatformScreeningSubmissionsService {
  constructor(
    private prisma: PrismaService,
    private livekitService: LivekitService,
    private config: ConfigService,
    private llmService: LlmService,
    private awsService: AwsService,
    private readonly logger: Logger,
  ) {}

  async createScreeningSubmission(
    dto: CreatePlatformScreeningFormSubmissionDto,
  ): Promise<CreatePlatformScreeningSubmissionResponseDto> {
    try {
      // TODO: [MIDDLEWARE] - check organisation balance before creating a submission

      const screeningJob = await this.prisma.screeningJob.findUnique({
        where: { id: dto.screeningJobId },
      });

      const screeningTemplate = await this.prisma.screeningTemplate.findUnique({
        where: { id: screeningJob?.screeningTemplateId },
      });

      const questionsAndTypes = screeningTemplate?.questions;

      // copy the template questions to submission chat questions

      const chat = dto.chat;

      for (let i = 0; i < questionsAndTypes.length; i++) {
        chat.push({
          agent: questionsAndTypes[i].question,
          human: '',
          answerType: questionsAndTypes[i].questionType,
          humanAudioUrl: '',
          index: i,
          answersGiven: [],
        });
      }

      const screeningSubmission =
        await this.prisma.screeningFormSubmission.create({
          data: {
            orgId: dto.orgId,
            orgAlias: dto.orgAlias,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phoneNumber: dto.phoneNumber,
            screeningJobId: dto.screeningJobId,
            chat: chat,
            createdAt: dto.createdAt,
            status: dto.status,
            upvotes: dto.upvotes,
            isViewed: dto.isViewed,
            isPrivate: dto.isPrivate,
          },
        });
      return {
        screeningSubmissionId: screeningSubmission.id,
      };
    } catch (error) {
      this.logger.error(
        `Unable to create screening submission: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/createScreeningSubmission',
      );
      throw error;
    }
  }

  async getScreeningSubmissionsByJobId(
    jobId: string,
  ): Promise<PlatformScreeningSubmissionListResponseDto> {
    try {
      const submissions = await this.prisma.screeningFormSubmission.findMany({
        where: {
          screeningJobId: jobId,
        },
      });

      const formattedSubmissions = submissions.map((submission) => ({
        ...submission,
        screeningSubmissionId: submission.id,
      }));

      return { screeningSubmissions: formattedSubmissions };
    } catch (error) {
      this.logger.error(
        `Unable to get screening submissions by job id: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/getScreeningSubmissionsByJobId',
      );
      return { screeningSubmissions: [] };
    }
  }

  async getScreeningSubmissionById(
    submissionId: string,
  ): Promise<PlatformScreeningSubmissionResponseDto> {
    try {
      const submission = await this.prisma.screeningFormSubmission.findUnique({
        where: {
          id: submissionId,
        },
      });

      const formattedSubmission = {
        ...submission,
        screeningSubmissionId: submission.id,
      };
      return formattedSubmission;
    } catch (error) {
      this.logger.error(
        `Unable to get screening submission by id: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/getScreeningSubmissionById',
      );
      throw error;
    }
  }

  async getScreeningSubmissionUsingEmailOrPhone(
    screeningJobId: string,
    email: string,
    phone: string,
  ): Promise<PlatformScreeningSubmissionResponseDto> {
    try {
      const submission = await this.prisma.screeningFormSubmission.findFirst({
        where: {
          screeningJobId: screeningJobId,
          email: email,
          phoneNumber: phone,
        },
      });

      const formattedSubmission = {
        ...submission,
        screeningSubmissionId: submission.id,
      };
      return formattedSubmission;
    } catch (error) {
      this.logger.error(
        `Unable to get screening submission by email or phone: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/getScreeningSubmissionUsingEmailOrPhone',
      );
      throw error;
    }
  }

  async updateViewStatus(submissionId: string): Promise<boolean> {
    try {
      const response = await this.prisma.screeningFormSubmission.update({
        where: {
          id: submissionId,
        },
        data: {
          isViewed: true,
        },
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Unable to update view status of submission: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/updateViewStatus',
      );
      return false;
    }
  }

  async updateScreeningSubmissionsStatus(
    submissionIds: string[],
    status: SubmissionStatusEnum,
  ): Promise<boolean> {
    try {
      const response = await this.prisma.screeningFormSubmission.updateMany({
        where: {
          id: {
            in: submissionIds,
          },
        },
        data: {
          status: status,
        },
      });
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(
        `Unable to update screening submission status: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/updateScreeningSubmissionsStatus',
      );
      return false;
    }
  }

  async getScreenerSubmissionsOfOrg(
    dto: GetPlatformScreeningSubmissionsOfOrgDto,
  ): Promise<PlatformScreeningSubmissionListResponseDto> {
    try {
      const submissions = await this.prisma.screeningFormSubmission.findMany({
        where: {
          orgAlias: dto.orgAlias,
          screeningJobId: dto.jobId,
          status: dto.status ? dto.status : undefined,
        },
        skip: dto.startAfter ? 1 : 0,
        take: dto.limit ? dto.limit : 10,
      });

      const formattedSubmissions = submissions.map((submission) => ({
        ...submission,
        screeningSubmissionId: submission.id,
      }));

      return { screeningSubmissions: formattedSubmissions };
    } catch (error) {
      this.logger.error(
        `Unable to get screening submissions of org: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/getScreenerSubmissionsOfOrg',
      );
      return { screeningSubmissions: [] };
    }
  }

  async createScreeningSubmissionStreamingRoom(
    screeningSubmissionId: string,
    screeningJobId: string,
    currDateTimeEpoch: number,
  ): Promise<PlatformScreeningSubmissionCreateStreamRoomResponseDto> {
    try {
      const roomName: string = 'screening_' + uuidv4();
      const participantName: string = 'candidate_' + uuidv4();

      const screeningJob = await this.prisma.screeningJob.findUnique({
        where: { id: screeningJobId },
      });
      const screeningTemplate = await this.prisma.screeningTemplate.findUnique({
        where: { id: screeningJob?.screeningTemplateId },
      });

      const result =
        await this.livekitService.createLiveKitParticipantTokenService(
          roomName,
          participantName,
          currDateTimeEpoch,
          {
            instructions: screeningTemplate?.prompt || '',
            openaiApiKey: this.config.get('OPENAI_API_KEY') || '',
            temperature: 0.7,
            maxOutputTokens: 1024,
            turnDetection: {
              type: 'server_vad',
              threshold: 0.5,
              silence_duration_ms: 2000,
            },
            modalities: ['text', 'audio'],
            voice: 'alloy',
            screeningJobId: screeningJobId,
            screeningSubmissionId: screeningSubmissionId,
          },
        );
      return {
        accessToken: result,
        url: this.config.get('LIVEKIT_URL') || '',
      };
    } catch (error) {
      this.logger.error(
        `Unable to create screening submission streaming room: ${error}`,
        error.stack,
        'PlatformScreeningSubmissionsService/createScreeningSubmissionStreamingRoom',
      );
      throw error;
    }
  }

  async updateScreeningSubmissionChat(
    dto: UpdatePlatformScreeningSubmissionChatDto,
  ) {
    return await this.prisma.screeningFormSubmission.update({
      where: {
        id: dto.screeningSubmissionId,
      },
      data: {
        chat: {
          set: {
            index: dto.index,
            human: dto.human,
            humanAudioUrl: dto.humanAudioUrl,
            answerType: dto.answerType,
          },
        },
      },
    });
  }

  async getTextFromAudioForPlatformScreeningSubmissionAnswer(
    file: Express.Multer.File,
    dto: GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  ): Promise<PlatformScreeningSubmissionTextFromAudioResponseDto> {
    try {
      const uniqueFileName = `organisations/${dto.orgId}/screeningsubmissions/${dto.screeningSubmissionId}/${dto.index}.${dto.fileType}`;

      const text: string =
        await this.llmService.generateTextFromAudioUsingDeepgramService(
          file.path,
          file.mimetype,
        );

      const audioUrl = await this.awsService.uploadFileToS3Service(
        this.config.get('AWS_S3_BUCKET_NAME') || '',
        file.path,
        uniqueFileName,
      );

      return { data: text, answerLocation: audioUrl?.url };
    } catch (error) {
      throw new Error('Unable to convert audio to text');
    }
  }
}
