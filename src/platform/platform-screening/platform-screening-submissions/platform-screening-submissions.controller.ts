import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlatformScreeningSubmissionsService } from './platform-screening-submissions.service';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';
import {
  CreatePlatformScreeningFormSubmissionDto,
  CreatePlatformScreeningSubmissionStreamingRoomTokenDto,
  GetPlatformScreeningSubmissionsOfOrgDto,
  GetPlatformScreeningSubmissionsUsingIdDto,
  GetPlatformScreeningSubmissionsUsingJobIdDto,
  GetPlatformScreeningSubmissionUsingEmailOrPhoneDto,
  GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  PlatformScreeningSubmissionCreateStreamRoomResponseDto,
  PlatformScreeningSubmissionListResponseDto,
  PlatformScreeningSubmissionResponseDto,
  PlatformScreeningSubmissionTextFromAudioResponseDto,
  UpdatePlatformScreeningSubmissionChatDto,
  UpdatePlatformScreeningSubmissionsStatusDto,
  UpdatePlatformScreeningSubmissionViewStatusDto,
} from './dto/platform-screening-submission-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlatformOrgApiKeyGuard } from 'src/platform/platform-auth/guard/apikey.guard';

@ApiTags('Platform Screening Submissions')
@UseGuards(PlatformUserJwtGuard)
@Controller('screeningSubmissions')
export class PlatformScreeningSubmissionsController {
  constructor(
    private platformScreeningSubmissionsService: PlatformScreeningSubmissionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Submission' })
  @ApiResponse({
    status: 201,
    description: 'Screening Submission Created',
    type: PlatformScreeningSubmissionListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createScreeningSubmission(
    @Body() dto: CreatePlatformScreeningFormSubmissionDto,
  ) {
    const response =
      this.platformScreeningSubmissionsService.createScreeningSubmission(dto);

    if (response) {
      return response;
    } else {
      return { message: 'Bad Request' };
    }
  }

  @Get('jobId')
  @ApiOperation({ summary: 'Get Screening Submissions using Job ID' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Screening Submissions',
    type: PlatformScreeningSubmissionListResponseDto,
  })
  async getScreeningSubmissionsUsingJobId(
    @Query() dto: GetPlatformScreeningSubmissionsUsingJobIdDto,
  ) {
    const submissions =
      await this.platformScreeningSubmissionsService.getScreeningSubmissionsByJobId(
        dto.jobId,
      );

    return {
      submissions: submissions,
    };
  }

  @Get('id')
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Screening Submission',
    type: PlatformScreeningSubmissionResponseDto,
  })
  @ApiOperation({ summary: 'Get Screening Submission using ID' })
  async getScreeningSubmissionUsingId(
    @Query() dto: GetPlatformScreeningSubmissionsUsingIdDto,
  ) {
    const response =
      await this.platformScreeningSubmissionsService.getScreeningSubmissionById(
        dto.screeningSubmissionId,
      );

    return response;
  }

  @Post('org/filters')
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Screening Submissions of an Organisation' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submissions',
    type: PlatformScreeningSubmissionListResponseDto,
  })
  async getScreeningSubmissionsOfOrg(
    @Body() dto: GetPlatformScreeningSubmissionsOfOrgDto,
  ) {
    const submissions =
      await this.platformScreeningSubmissionsService.getScreenerSubmissionsOfOrg(
        dto,
      );

    return {
      screeningSubmissions: submissions,
    };
  }

  @Get('email-phone')
  @ApiOperation({ summary: 'Get Screening Submission using Email ir Phone' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission',
    type: PlatformScreeningSubmissionResponseDto,
  })
  async getScreeningSubmissionsUsingEmailPhone(
    @Body() dto: GetPlatformScreeningSubmissionUsingEmailOrPhoneDto,
  ) {
    const submission =
      await this.platformScreeningSubmissionsService.getScreeningSubmissionUsingEmailOrPhone(
        dto.jobId,
        dto.email,
        dto.phone,
      );
    if (submission) {
      return submission;
    } else {
      return { message: 'No Submission Found' };
    }
  }

  @Put()
  @ApiOperation({ summary: 'Update Screening Submission Chat Objects' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission Chat Updated',
  })
  async updateScreeningSubmissionChat(
    @Body() dto: UpdatePlatformScreeningSubmissionChatDto,
  ) {
    return this.platformScreeningSubmissionsService.updateScreeningSubmissionChat(
      dto,
    );
  }

  @Post('textFromAudio')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Convert Audio to Text' })
  @ApiResponse({
    status: 200,
    description: 'Text from Audio',
    type: PlatformScreeningSubmissionTextFromAudioResponseDto,
  })
  async convertAudioToText(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  ) {
    const response =
      await this.platformScreeningSubmissionsService.getTextFromAudioForPlatformScreeningSubmissionAnswer(
        file,
        dto,
      );

    return response;
  }

  @Put('view')
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Screening Submission View Status' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission View Status Updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async updateScreeningSubmissionViewStatus(
    @Query() dto: UpdatePlatformScreeningSubmissionViewStatusDto,
  ) {
    const response =
      await this.platformScreeningSubmissionsService.updateViewStatus(
        dto.screeningSubmissionId,
      );

    if (response) {
      return {
        status: 200,
        description: 'Screening Submission View Status Updated',
      };
    } else {
      return {
        status: 400,
        description: 'Bad Request',
      };
    }
  }

  @Put('status')
  @UseGuards(PlatformOrgApiKeyGuard)
  @UseGuards(PlatformUserJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Screening Submission Status' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission Status Updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async updateScreeningSubmissionStatus(
    @Body() dto: UpdatePlatformScreeningSubmissionsStatusDto,
  ) {
    const response =
      await this.platformScreeningSubmissionsService.updateScreeningSubmissionsStatus(
        dto.screeningSubmissionIds,
        dto.status,
      );
    if (response) {
      return {
        status: 200,
        description: 'Screening Submission Status Updated',
      };
    } else {
      return {
        status: 400,
        description: 'Bad Request - Invalid Submission Ids',
      };
    }
  }

  @Post('stream/start')
  @ApiOperation({ summary: 'Create Screening Submission Streaming Room' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission Streaming Room Created',
    type: PlatformScreeningSubmissionCreateStreamRoomResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createScreeningStreamRoom(
    @Body() dto: CreatePlatformScreeningSubmissionStreamingRoomTokenDto,
  ) {
    const response =
      await this.platformScreeningSubmissionsService.createScreeningSubmissionStreamingRoom(
        dto.screeningJobId,
        dto.screeningSubmissionId,
        dto.currDateTimeEpoch,
      );
    if (response) {
      return response;
    } else {
      return { message: 'Bad Request' };
    }
  }
}
