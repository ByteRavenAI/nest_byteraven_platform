import { Test, TestingModule } from '@nestjs/testing';
import { PlatformUserService } from './platform-user.service';

describe('PlatformUserService', () => {
  let service: PlatformUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformUserService],
    }).compile();

    service = module.get<PlatformUserService>(PlatformUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
