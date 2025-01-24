import {
  Body,
  Controller,
  Get,
  Header,
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
  @Header('Content-Type', 'application/json')
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiOperation({ summary: 'Create a new Screening Template' })
  @ApiResponse({
    status: 201,
    description: 'Screening Template Created',
    type: ApiResponseWrapper<boolean>,
  })
  async createScreeningTemplate(
    @Req() req: Request,
    @Body() dto: CreateScreeningTemplateDto,
  ): Promise<ApiResponseWrapper<boolean>> {
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
        true,
      );
    } else {
      throw new HttpException(
        'Failed to create Screening Template',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Get all Screening Templates of Organisation' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Templates Fetched',
    type: ApiResponseWrapper<GetAllPlatformScreeningTemplatesOfOrgResponseDto>,
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
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Generate Screening Template Questions' })
  @UseGuards(PlatformOrgApiKeyGuard)
  @ApiSecurity('X-API-KEY')
  @ApiResponse({
    status: 200,
    description: 'Screening Template Questions Generated',
    type: ApiResponseWrapper<string[]>,
  })
  async generateScreeningTemplateQuestions(
    @Body() dto: GenerateScreeningTemplateQuestionsDto,
  ): Promise<ApiResponseWrapper<string[]>> {
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
