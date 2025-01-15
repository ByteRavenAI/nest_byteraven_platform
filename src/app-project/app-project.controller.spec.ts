import { Test, TestingModule } from '@nestjs/testing';
import { AppProjectController } from './app-project.controller';

describe('AppProjectController', () => {
  let controller: AppProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppProjectController],
    }).compile();

    controller = module.get<AppProjectController>(AppProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
