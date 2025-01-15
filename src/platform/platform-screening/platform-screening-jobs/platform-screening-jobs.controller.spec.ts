import { Test, TestingModule } from '@nestjs/testing';
import { PlatformScreeningJobsController } from './platform-screening-jobs.controller';

describe('PlatformScreeningJobsController', () => {
  let controller: PlatformScreeningJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformScreeningJobsController],
    }).compile();

    controller = module.get<PlatformScreeningJobsController>(PlatformScreeningJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
