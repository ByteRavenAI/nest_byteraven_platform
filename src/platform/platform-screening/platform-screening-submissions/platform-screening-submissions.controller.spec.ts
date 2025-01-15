import { Test, TestingModule } from '@nestjs/testing';
import { PlatformScreeningSubmissionsController } from './platform-screening-submissions.controller';

describe('PlatformScreeningSubmissionsController', () => {
  let controller: PlatformScreeningSubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformScreeningSubmissionsController],
    }).compile();

    controller = module.get<PlatformScreeningSubmissionsController>(PlatformScreeningSubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
