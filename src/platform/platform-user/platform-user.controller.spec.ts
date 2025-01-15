import { Test, TestingModule } from '@nestjs/testing';
import { PlatformUserController } from './platform-user.controller';

describe('PlatformUserController', () => {
  let controller: PlatformUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformUserController],
    }).compile();

    controller = module.get<PlatformUserController>(PlatformUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
