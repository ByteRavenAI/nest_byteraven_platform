import { Test, TestingModule } from '@nestjs/testing';
import { PlatformScreeningTemplatesService } from './platform-screening-templates.service';

describe('PlatformScreeningTemplatesService', () => {
  let service: PlatformScreeningTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformScreeningTemplatesService],
    }).compile();

    service = module.get<PlatformScreeningTemplatesService>(PlatformScreeningTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
