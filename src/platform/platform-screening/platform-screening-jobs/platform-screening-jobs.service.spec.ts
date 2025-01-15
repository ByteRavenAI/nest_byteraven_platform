import { Test, TestingModule } from '@nestjs/testing';
import { PlatformScreeningJobsService } from './platform-screening-jobs.service';

describe('PlatformScreeningJobsService', () => {
  let service: PlatformScreeningJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformScreeningJobsService],
    }).compile();

    service = module.get<PlatformScreeningJobsService>(PlatformScreeningJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
