import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PlatformScreeningTemplatesService } from './platform-screening-templates.service';
import { CreateScreeningTemplateDto } from './dto/platform-screening-template-dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlatformUserJwtGuard } from 'src/platform/platform-auth/guard/jwt.guard';

@UseGuards(PlatformUserJwtGuard)
@ApiTags('Platform Screening Templates')
@Controller('screeningTemplates')
export class PlatformScreeningTemplatesController {
  constructor(
    private platformScreeningTemplatesService: PlatformScreeningTemplatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Screening Template' })
  async createScreeningTemplate(@Body() dto: CreateScreeningTemplateDto) {
    return this.platformScreeningTemplatesService.createScreeningTemplate();
  }

  @Get()
  @ApiOperation({ summary: 'Get all Screening Templates of Organisation' })
  async getScreeningTemplates() {
    return this.platformScreeningTemplatesService.getScreeningTemplatesOfOrg();
  }

  @Post()
  @ApiOperation({ summary: 'Generate Screening Template Questions' })
  async generateScreeningTemplateQuestions() {
    return this.platformScreeningTemplatesService.generateScreeningTemplateQuestions();
  }
}
