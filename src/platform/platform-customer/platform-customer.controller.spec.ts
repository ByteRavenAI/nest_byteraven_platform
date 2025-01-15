import { Test, TestingModule } from '@nestjs/testing';
import { PlatformCustomerController } from './platform-customer.controller';

describe('PlatformCustomerController', () => {
  let controller: PlatformCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformCustomerController],
    }).compile();

    controller = module.get<PlatformCustomerController>(PlatformCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
