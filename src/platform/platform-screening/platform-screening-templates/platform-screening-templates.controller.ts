import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express'; // Import Request
import { PlatformScreeningTemplatesService } from './platform-screening-templates.service';
import {
  CreatePlatformScreeningTemplateResponseDto,
  CreateScreeningTemplateDto,
  GenerateScreeningTemplateQuestionsDto,
  GetAllPlatformScreeningTemplatesOfOrgResponseDto,
} from './dto/platform-screening-template-dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';
import { PlatformOrgApiKeyGuard } from 'src/platform/platform-auth/guard/apikey.guard';

@UseGuards(PlatformOrgApiKeyGuard)
@UseGuards(PlatformUserJwtGuard)
@ApiBearerAuth()
@ApiTags('Platform Screening Templates')
@Controller('screeningTemplates')
export class PlatformScreeningTemplatesController {
  constructor(
    private platformScreeningTemplatesService: PlatformScreeningTemplatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Template' })
  @ApiResponse({
    status: 201,
    description: 'Screening Template Created',
    type: CreatePlatformScreeningTemplateResponseDto,
  })
  async createScreeningTemplate(@Body() dto: CreateScreeningTemplateDto) {
    const success: boolean =
      await this.platformScreeningTemplatesService.createScreeningTemplate(dto);
    if (success) {
      return {
        success: true,
        message: 'Screening Template Created',
      };
    } else {
      return {
        success: false,
        message: 'Screening Template Creation Failed',
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Screening Templates of Organisation' })
  @ApiResponse({
    status: 200,
    description: 'Screening Templates Fetched',
    type: GetAllPlatformScreeningTemplatesOfOrgResponseDto,
  })
  async getScreeningTemplates(@Req() req: Request) {
    // Access organization details from req.user
    const { orgId, orgAlias } = req.user as {
      orgId: string;
      orgAlias: string;
    };

    const templates =
      await this.platformScreeningTemplatesService.getScreeningTemplatesOfOrg(
        orgId, // Pass the orgId here
      );

    return {
      success: true,
      data: templates,
    };
  }

  @Post('generateQuestions')
  @ApiOperation({ summary: 'Generate Screening Template Questions' })
  @ApiResponse({
    status: 200,
    description: 'Screening Template Questions Generated',
    type: GetAllPlatformScreeningTemplatesOfOrgResponseDto,
  })
  async generateScreeningTemplateQuestions(
    @Body() dto: GenerateScreeningTemplateQuestionsDto,
  ) {
    const questions =
      await this.platformScreeningTemplatesService.generateScreeningTemplateQuestions(
        dto.jobTitle, // Pass the orgId here
      );

    return {
      success: true,
      questions,
    };
  }
}
