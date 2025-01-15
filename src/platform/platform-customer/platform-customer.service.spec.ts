import { Test, TestingModule } from '@nestjs/testing';
import { PlatformCustomerService } from './platform-customer.service';

describe('PlatformCustomerService', () => {
  let service: PlatformCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformCustomerService],
    }).compile();

    service = module.get<PlatformCustomerService>(PlatformCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
