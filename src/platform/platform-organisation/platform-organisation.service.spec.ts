import { Test, TestingModule } from '@nestjs/testing';
import { PlatformOrganisationService } from './platform-organisation.service';

describe('PlatformOrganisationService', () => {
  let service: PlatformOrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformOrganisationService],
    }).compile();

    service = module.get<PlatformOrganisationService>(PlatformOrganisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
