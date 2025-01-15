import { Test, TestingModule } from '@nestjs/testing';
import { PlatformOrganisationController } from './platform-organisation.controller';

describe('PlatformOrganisationController', () => {
  let controller: PlatformOrganisationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformOrganisationController],
    }).compile();

    controller = module.get<PlatformOrganisationController>(PlatformOrganisationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
