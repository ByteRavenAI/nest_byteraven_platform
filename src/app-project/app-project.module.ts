import { Module } from '@nestjs/common';
import { AppProjectController } from './app-project.controller';

@Module({
  controllers: [AppProjectController]
})
export class AppProjectModule {}
