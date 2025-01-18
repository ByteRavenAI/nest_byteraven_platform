import { Injectable } from '@nestjs/common';
import { SubmissionStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePlatformScreeningFormSubmissionDto,
  GetPlatformScreeningSubmissionsOfOrgDto,
  GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
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
  ) {}

  //   try {
  //     const screeningSubmission: IScreeningFormSubmission =
  //       ScreeningFormSubmissionSchema.parse(req.body);

  //     // [MIDDLEWARE] - check organisation balance before creating a submission
  //     const proceedAhead: boolean = await checkOrganisationBalanceMiddleware(
  //       screeningSubmission.orgId,
  //       screeningSubmission.chat.length > 0 // if chat length is less than 0, it is a real time screening
  //         ? OrganisationBillingUsageType.fixedQuestionsVoiceScreening
  //         : OrganisationBillingUsageType.realTimeVoiceScreening
  //     );
  //     if (proceedAhead) {
  //       const result: IScreeningFormSubmissionInterface | null =
  //         await createScreeningSubmissionV2Repo(screeningSubmission);
  //       if (result) {
  //         res.status(200).json({
  //           success: true,
  //           data: result.screeningFormSubmissionId,
  //         });
  //         // [MIDDLEWARE] - update organisation balance after creating a submission
  //         const screeningJob: IScreeningJobInterface | null =
  //           await getScreeningJobUsingIdRepo(screeningSubmission.screeningJobId);
  //         const screeningTemplate: IScreeningTemplateInterface | null =
  //           await getScreeningTemplateUsingIdRepo(
  //             screeningJob?.screeningTemplateId || ""
  //           );
  //         screeningSubmissionUpdateOrganisationBalanceHelper(
  //           // screeningSubmission,
  //           screeningJob,
  //           screeningTemplate
  //         );

  //         screeningSubmissionStreakOfUserUpdateHelper(result);
  //       } else {
  //         res
  //           .status(500)
  //           .json({ error: "Failed to Create Screening Submission" });
  //       }
  //     } else {
  //       logger.error(
  //         "Insufficient Organsiation Balance or Balance Model not yet created"
  //       );
  //       res.status(401).json({
  //         error:
  //           "Insufficient Organsiation Balance or Balance Model not yet created",
  //       });
  //     }
  //   } catch (error) {
  //     logger.error("Error in createScreeningSubmissionController: ", error);
  //     res.status(500).json({ error: "Failed to create submission" });
  //   }
  // };

  async createScreeningSubmission(
    dto: CreatePlatformScreeningFormSubmissionDto,
  ) {
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
    return screeningSubmission;
  }

  async getScreeningSubmissionsByJobId(jobId: string) {
    return await this.prisma.screeningFormSubmission.findMany({
      where: {
        screeningJobId: jobId,
      },
    });
  }

  async getScreeningSubmissionById(submissionId: string) {
    return await this.prisma.screeningFormSubmission.findUnique({
      where: {
        id: submissionId,
      },
    });
  }

  async getScreeningSubmissionUsingEmailOrPhone(
    screeningJobId: string,
    email: string,
    phone: string,
  ) {
    return await this.prisma.screeningFormSubmission.findMany({
      where: {
        screeningJobId: screeningJobId,
        email: email,
        phoneNumber: phone,
      },
    });
  }

  async updateViewStatus(submissionId: string) {
    return await this.prisma.screeningFormSubmission.update({
      where: {
        id: submissionId,
      },
      data: {
        isViewed: true,
      },
    });
  }

  async updateScreeningSubmissionsStatus(
    submissionIds: string[],
    status: SubmissionStatusEnum,
  ) {
    return await this.prisma.screeningFormSubmission.updateMany({
      where: {
        id: {
          in: submissionIds,
        },
      },
      data: {
        status: status,
      },
    });
  }

  async getScreenerSubmissionsOfOrg(
    dto: GetPlatformScreeningSubmissionsOfOrgDto,
  ) {
    return await this.prisma.screeningFormSubmission.findMany({
      where: {
        orgAlias: dto.orgAlias,
        screeningJobId: dto.jobId,
        status: dto.status ? dto.status : undefined,
      },
      skip: dto.startAfter ? 1 : 0,
      take: dto.limit ? dto.limit : 10,
    });
  }

  async createScreeningSubmissionStreamingRoom(
    screeningSubmissionId: string,
    screeningJobId: string,
    currDateTimeEpoch: number,
  ) {
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
  ) {
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
