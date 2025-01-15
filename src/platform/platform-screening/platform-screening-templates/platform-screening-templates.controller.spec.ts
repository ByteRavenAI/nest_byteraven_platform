import { Test, TestingModule } from '@nestjs/testing';
import { PlatformScreeningTemplatesController } from './platform-screening-templates.controller';

describe('PlatformScreeningTemplatesController', () => {
  let controller: PlatformScreeningTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformScreeningTemplatesController],
    }).compile();

    controller = module.get<PlatformScreeningTemplatesController>(PlatformScreeningTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
