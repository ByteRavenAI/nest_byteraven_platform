import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express'; // Import Request
import { PlatformScreeningTemplatesService } from './platform-screening-templates.service';
import {
  CreateScreeningTemplateDto,
  GenerateScreeningTemplateQuestionsDto,
  GetAllPlatformScreeningTemplatesOfOrgResponseDto,
} from './dto/platform-screening-template-dto';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformOrgApiKeyGuard } from 'src/platform/platform-auth/guard/apikey.guard';
import { ApiResponseWrapper } from 'src/helpers/http-response-wrapper';
import { HttpExceptionFilter } from 'src/helpers/http-exception-filter';

@UseFilters(HttpExceptionFilter)
@ApiTags('Platform Screening Templates')
@Controller('platform/platform-screening-template')
export class PlatformScreeningTemplatesController {
  constructor(
    private platformScreeningTemplatesService: PlatformScreeningTemplatesService,
  ) {}

  @Post()
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiOperation({ summary: 'Create a new Screening Template' })
  @ApiResponse({
    status: 201,
    description: 'Screening Template Created',
  })
  async createScreeningTemplate(
    @Req() req: Request,
    @Body() dto: CreateScreeningTemplateDto,
  ): Promise<ApiResponseWrapper<any>> {
    const { orgId, orgAlias } = req.org as {
      orgId: string;
      orgAlias: string;
    };
    const success: boolean =
      await this.platformScreeningTemplatesService.createScreeningTemplate(
        orgId,
        orgAlias,
        dto,
      );
    if (success) {
      return new ApiResponseWrapper(
        HttpStatus.CREATED,
        'Platform User created successfully',
        success,
      );
    } else {
      throw new HttpException(
        'Failed to create Screening Template',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Screening Templates of Organisation' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Templates Fetched',
    type: GetAllPlatformScreeningTemplatesOfOrgResponseDto,
  })
  async getScreeningTemplates(
    @Req() req: Request,
  ): Promise<
    ApiResponseWrapper<GetAllPlatformScreeningTemplatesOfOrgResponseDto>
  > {
    try {
      const { orgId, orgAlias } = req.org as {
        orgId: string;
        orgAlias: string;
      };

      const templates =
        await this.platformScreeningTemplatesService.getScreeningTemplatesOfOrg(
          orgId, // Pass the orgId here
        );

      return new ApiResponseWrapper(
        HttpStatus.OK,
        'Screening Templates Fetched',
        templates,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Screening Templates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generateQuestions')
  @ApiOperation({ summary: 'Generate Screening Template Questions' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Template Questions Generated',
  })
  async generateScreeningTemplateQuestions(
    @Body() dto: GenerateScreeningTemplateQuestionsDto,
  ): Promise<ApiResponseWrapper<any>> {
    const questions =
      await this.platformScreeningTemplatesService.generateScreeningTemplateQuestions(
        dto.jobTitle, // Pass the orgId here
      );

    return new ApiResponseWrapper(
      HttpStatus.OK,
      'Screening Template Questions Generated',
      questions,
    );
  }
}
