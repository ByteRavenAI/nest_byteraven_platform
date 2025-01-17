import { Global, Module } from '@nestjs/common';
import { LlmService } from './llm.service';

@Global()
@Module({
  providers: [LlmService],
})
export class LlmModule {}
