import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlatformScreeningSubmissionsService } from './platform-screening-submissions.service';
import { Express } from 'express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreatePlatformScreeningFormSubmissionDto,
  CreatePlatformScreeningSubmissionResponseDto,
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
import { HttpExceptionFilter } from 'src/helpers/http-exception-filter';
import { ApiResponseWrapper } from 'src/helpers/http-response-wrapper';

@UseFilters(HttpExceptionFilter)
@ApiTags('Platform Screening Submissions')
@Controller('platform/platform-screening-submission')
export class PlatformScreeningSubmissionsController {
  constructor(
    private platformScreeningSubmissionsService: PlatformScreeningSubmissionsService,
  ) {}

  @Post()
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Create a new Screening Submission' })
  @ApiResponse({
    status: 201,
    description: 'Screening Submission Created',
    type: ApiResponseWrapper<CreatePlatformScreeningSubmissionResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createScreeningSubmission(
    @Body() dto: CreatePlatformScreeningFormSubmissionDto,
  ): Promise<ApiResponseWrapper<CreatePlatformScreeningSubmissionResponseDto>> {
    const response =
      await this.platformScreeningSubmissionsService.createScreeningSubmission(
        dto,
      );

    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Platform User created successfully',
        response,
      );
    } else {
      throw new HttpException(
        'Failed to create Screening Submission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('jobId')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Get Screening Submissions using Job ID' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Submissions',
    type: ApiResponseWrapper<PlatformScreeningSubmissionListResponseDto>,
  })
  async getScreeningSubmissionsUsingJobId(
    @Query() dto: GetPlatformScreeningSubmissionsUsingJobIdDto,
  ): Promise<ApiResponseWrapper<PlatformScreeningSubmissionListResponseDto>> {
    try {
      const submissions =
        await this.platformScreeningSubmissionsService.getScreeningSubmissionsByJobId(
          dto.jobId,
        );

      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Submissions',
        submissions,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get Screening Submissions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('id')
  @Header('Content-Type', 'application/json')
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Submission',
    type: ApiResponseWrapper<PlatformScreeningSubmissionResponseDto>,
  })
  @ApiOperation({ summary: 'Get Screening Submission using ID' })
  async getScreeningSubmissionUsingId(
    @Query() dto: GetPlatformScreeningSubmissionsUsingIdDto,
  ): Promise<ApiResponseWrapper<PlatformScreeningSubmissionResponseDto>> {
    const response =
      await this.platformScreeningSubmissionsService.getScreeningSubmissionById(
        dto.screeningSubmissionId,
      );

    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Submission',
        response,
      );
    } else {
      throw new HttpException(
        'Screening Submission not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('org/filters')
  @Header('Content-Type', 'application/json')
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiOperation({ summary: 'Get Screening Submissions of an Organisation' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submissions',
    type: ApiResponseWrapper<PlatformScreeningSubmissionListResponseDto>,
  })
  async getScreeningSubmissionsOfOrg(
    @Body() dto: GetPlatformScreeningSubmissionsOfOrgDto,
  ): Promise<ApiResponseWrapper<PlatformScreeningSubmissionListResponseDto>> {
    const submissions =
      await this.platformScreeningSubmissionsService.getScreenerSubmissionsOfOrg(
        dto,
      );

    return new ApiResponseWrapper(
      HttpStatus.OK,
      'Screening Submissions',
      submissions,
    );
  }

  @Get('email-phone')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Get Screening Submission using Email ir Phone' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission',
    type: ApiResponseWrapper<PlatformScreeningSubmissionResponseDto>,
  })
  async getScreeningSubmissionsUsingEmailPhone(
    @Query() dto: GetPlatformScreeningSubmissionUsingEmailOrPhoneDto,
  ): Promise<ApiResponseWrapper<PlatformScreeningSubmissionResponseDto>> {
    const submission =
      await this.platformScreeningSubmissionsService.getScreeningSubmissionUsingEmailOrPhone(
        dto.jobId,
        dto.email,
        dto.phone,
      );

    if (submission) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Submission',
        submission,
      );
    } else {
      throw new HttpException(
        'Screening Submission not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put()
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Update Screening Submission Chat Objects' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission Chat Updated',
    type: ApiResponseWrapper<boolean>,
  })
  async updateScreeningSubmissionChat(
    @Body() dto: UpdatePlatformScreeningSubmissionChatDto,
  ): Promise<ApiResponseWrapper<boolean>> {
    const success =
      await this.platformScreeningSubmissionsService.updateScreeningSubmissionChat(
        dto,
      );

    if (success) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Submission Chat Updated',
        true,
      );
    } else {
      throw new HttpException(
        'Failed to update Screening Submission Chat',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('textFromAudio')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Convert Audio to Text' })
  @ApiResponse({
    status: 200,
    description: 'Text from Audio',
    type: ApiResponseWrapper<PlatformScreeningSubmissionTextFromAudioResponseDto>,
  })
  async convertAudioToText(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: GetTextFromAudioForPlatformScreeningSubmissionAnswerDto,
  ): Promise<
    ApiResponseWrapper<PlatformScreeningSubmissionTextFromAudioResponseDto>
  > {
    const response =
      await this.platformScreeningSubmissionsService.getTextFromAudioForPlatformScreeningSubmissionAnswer(
        file,
        dto,
      );

    if (response) {
      return new ApiResponseWrapper(HttpStatus.OK, 'Text from Audio', response);
    } else {
      throw new HttpException(
        'Failed to convert Audio to Text',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('view')
  @Header('Content-Type', 'application/json')
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiOperation({ summary: 'Update Screening Submission View Status' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission View Status Updated',
    type: ApiResponseWrapper<boolean>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async updateScreeningSubmissionViewStatus(
    @Query() dto: UpdatePlatformScreeningSubmissionViewStatusDto,
  ): Promise<ApiResponseWrapper<boolean>> {
    const response =
      await this.platformScreeningSubmissionsService.updateViewStatus(
        dto.screeningSubmissionId,
      );

    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Submission View Status Updated',
        true,
      );
    } else {
      throw new HttpException(
        'Failed to update Screening Submission View Status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('status')
  @Header('Content-Type', 'application/json')
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiOperation({ summary: 'Update Screening Submission Status' })
  @ApiResponse({
    status: 200,
    description: 'Screening Submission Status Updated',
    type: ApiResponseWrapper<boolean>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async updateScreeningSubmissionStatus(
    @Body() dto: UpdatePlatformScreeningSubmissionsStatusDto,
  ): Promise<ApiResponseWrapper<boolean>> {
    const response =
      await this.platformScreeningSubmissionsService.updateScreeningSubmissionsStatus(
        dto.screeningSubmissionIds,
        dto.status,
      );
    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Submission Status Updated',
        true,
      );
    } else {
      throw new HttpException(
        'Failed to update Screening Submission Status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('stream/start')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Create Screening Submission Streaming Room' })
  @ApiResponse({
    status: 201,
    description: 'Screening Submission Streaming Room Created',
    type: ApiResponseWrapper<PlatformScreeningSubmissionCreateStreamRoomResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async createScreeningStreamRoom(
    @Body() dto: CreatePlatformScreeningSubmissionStreamingRoomTokenDto,
  ): Promise<
    ApiResponseWrapper<PlatformScreeningSubmissionCreateStreamRoomResponseDto>
  > {
    const response =
      await this.platformScreeningSubmissionsService.createScreeningSubmissionStreamingRoom(
        dto.screeningSubmissionId,
        dto.screeningJobId,

        dto.currDateTimeEpoch,
      );
    if (response) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Screening Submission Streaming Room Created',
        response,
      );
    } else {
      throw new HttpException(
        'Failed to create Screening Submission Streaming Room',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
