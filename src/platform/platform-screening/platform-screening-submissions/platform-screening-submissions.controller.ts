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
import { ApiTags } from '@nestjs/swagger';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';
import {
  CreatePlatformScreeningFormSubmissionDto,
  CreatePlatformScreeningSubmissionStreamingRoomTokenDto,
  GetPlatformScreeningSubmissionsOfOrgDto,
  GetPlatformScreeningSubmissionsUsingIdDto,
  GetPlatformScreeningSubmissionsUsingJobIdDto,
  GetPlatformScreeningSubmissionUsingEmailOrPhoneDto,
  GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  UpdatePlatformScreeningSubmissionChatDto,
  UpdatePlatformScreeningSubmissionsStatusDto,
  UpdatePlatformScreeningSubmissionViewStatusDto,
} from './dto/platform-screening-submission-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Platform Screening Submissions')
@UseGuards(PlatformUserJwtGuard)
@Controller('screeningSubmissions')
export class PlatformScreeningSubmissionsController {
  constructor(
    private platformScreeningSubmissionsService: PlatformScreeningSubmissionsService,
  ) {}

  @Post()
  async createScreeningSubmission(
    @Body() dto: CreatePlatformScreeningFormSubmissionDto,
  ) {
    return this.platformScreeningSubmissionsService.createScreeningSubmission(
      dto,
    );
  }

  @Get('jobId')
  async getScreeningSubmissionsUsingJobId(
    @Query() dto: GetPlatformScreeningSubmissionsUsingJobIdDto,
  ) {
    return this.platformScreeningSubmissionsService.getScreeningSubmissionsByJobId(
      dto.jobId,
    );
  }

  @Get('id')
  async getScreeningSubmissionUsingId(
    @Query() dto: GetPlatformScreeningSubmissionsUsingIdDto,
  ) {
    return this.platformScreeningSubmissionsService.getScreeningSubmissionById(
      dto.screeningSubmissionId,
    );
  }

  @Post('org/filters')
  async getScreeningSubmissionsOfOrg(
    @Body() dto: GetPlatformScreeningSubmissionsOfOrgDto,
  ) {
    return this.platformScreeningSubmissionsService.getScreenerSubmissionsOfOrg(
      dto,
    );
  }

  @Get('email-phone')
  async getScreeningSubmissionsUsingEmailPhone(
    @Body() dto: GetPlatformScreeningSubmissionUsingEmailOrPhoneDto,
  ) {
    return this.platformScreeningSubmissionsService.getScreeningSubmissionUsingEmailOrPhone(
      dto.jobId,
      dto.email,
      dto.phone,
    );
  }

  @Put()
  async updateScreeningSubmissionChat(
    @Body() dto: UpdatePlatformScreeningSubmissionChatDto,
  ) {
    return this.platformScreeningSubmissionsService.updateScreeningSubmissionChat(
      dto,
    );
  }

  @Post('textFromAudio')
  @UseInterceptors(FileInterceptor('file'))
  async convertAudioToText(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  ) {
    return this.platformScreeningSubmissionsService.getTextFromAudioForPlatformScreeningSubmissionAnswer(
      file,
      dto,
    );
  }

  @Put('view')
  async updateScreeningSubmissionViewStatus(
    @Query() dto: UpdatePlatformScreeningSubmissionViewStatusDto,
  ) {
    return this.platformScreeningSubmissionsService.updateViewStatus(
      dto.screeningSubmissionId,
    );
  }

  @Put('status')
  async updateScreeningSubmissionStatus(
    @Body() dto: UpdatePlatformScreeningSubmissionsStatusDto,
  ) {
    return this.platformScreeningSubmissionsService.updateScreeningSubmissionsStatus(
      dto.screeningSubmissionIds,
      dto.status,
    );
  }

  @Post('stream/start')
  async createScreeningStreamRoom(
    @Body() dto: CreatePlatformScreeningSubmissionStreamingRoomTokenDto,
  ) {
    return this.platformScreeningSubmissionsService.createScreeningSubmissionStreamingRoom(
      dto.screeningJobId,
      dto.screeningSubmissionId,
      dto.currDateTimeEpoch,
    );
  }
}
