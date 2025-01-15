import { Test, TestingModule } from '@nestjs/testing';
import { PlatformScreeningSubmissionsService } from './platform-screening-submissions.service';

describe('PlatformScreeningSubmissionsService', () => {
  let service: PlatformScreeningSubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformScreeningSubmissionsService],
    }).compile();

    service = module.get<PlatformScreeningSubmissionsService>(PlatformScreeningSubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
