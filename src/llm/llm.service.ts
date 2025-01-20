import { Injectable } from '@nestjs/common';

import { ChatOpenAI } from '@langchain/openai';

import { ConfigService } from '@nestjs/config';
import {
  promptGenerateJd,
  promptGenerateScreeningTemplateQuestions,
} from './prompts/llm-prompts';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import path from 'path';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class LlmService {
  constructor(config: ConfigService) {
    this.configOpenAiApiKey = config.get('OPENAI_API_KEY');
    this.configOpenAiLlmModel = config.get('OPENAI_LLM_MODEL');
    this.configEllevenLabsModel = config.get('ELLEVENLABS_MODEL');
    this.configEllevenLabsApiKey = config.get('ELLEVENLABS_API_KEY');
    this.configEllevenLabsVoiceId = config.get('ELLEVENLABS_VOICE_ID');
    this.configDeepgramApiKey = config.get('DEEPGRAM_API_KEY');
  }

  configOpenAiApiKey: string;
  configOpenAiLlmModel: string;
  configEllevenLabsModel: string;
  configEllevenLabsApiKey: string;
  configEllevenLabsVoiceId: string;
  configDeepgramApiKey: string;

  async generateScreeningTemplateQuestionsService(
    jobTitle: string,
  ): Promise<string[]> {
    try {
      const questions: string[] = [];

      // 1. Define the model
      const model = new ChatOpenAI({
        openAIApiKey: this.configOpenAiApiKey,
        modelName: this.configOpenAiLlmModel,
      });

      // 2. Define the output parser
      const outputParser = new JsonOutputFunctionsParser();

      // 3. Define the output json schema
      const outputJsonSchema = {
        name: 'generate_screening_template_questions',
        description: 'Generates the Screening Questions',
        parameters: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'questions that can be asked',
            },
          },
        },
        required: ['questions'],
      };

      // 4. Get the Prompt Template
      const promptTemplate = promptGenerateScreeningTemplateQuestions();

      // 5. Define the chain
      const chain = promptTemplate.pipe(
        model
          .bind({
            functions: [outputJsonSchema],
            function_call: { name: 'generate_screening_template_questions' },
          })
          .pipe(outputParser),
      );

      // 6. Get the result
      const result = await chain.invoke({
        jobTitle: jobTitle,
      });

      const resultMap = new Map(Object.entries(result));
      questions.push(...(resultMap.get('questions') as string[]));
      return questions;
    } catch (error) {
      return [];
    }
  }

  // return file 
  async generateAudioFromTextUsingEllevenLabsService(
    text: string,
  ): Promise<string> {
    try {
      const speechFile = path.resolve('./speech.mp3');

      // Construct the request payload
      const data = {
        model_id: this.configEllevenLabsModel,
        text: text,
        voice_settings: {
          stability: 1,
          similarity_boost: 1,
        },
      };

      const headers = {
        Accept: 'audio/mp3',
        'Content-Type': 'application/json',
        'xi-api-key': `${this.configEllevenLabsApiKey}`,
      };

      // Make the POST request
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.configEllevenLabsVoiceId}`,
        data,
        { headers, responseType: 'arraybuffer' },
      );

      if (response.data) {
        const buffer = Buffer.from(response.data);
        await fs.promises.writeFile(speechFile, buffer);
        return speechFile;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async generateTextFromAudioUsingDeepgramService(
    filePath: string,
    contentType: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true',
        fs.createReadStream(filePath),
        {
          headers: {
            Authorization: `Token ${this.configDeepgramApiKey}`,
            'Content-Type': contentType,
          },
        },
      );
      // log the complete json response

      console.log(response.data.results.channels[0].alternatives);
      return response.data.results.channels[0].alternatives[0].transcript;
    } catch (error) {
      throw error;
    }
  }

  async generateJdService(jdInfo: string): Promise<string> {
    try {
      // 1. Define the model
      const model = new ChatOpenAI({
        openAIApiKey: this.configOpenAiApiKey,
        modelName: this.configOpenAiLlmModel,
      });

      // 2. Define the output parser
      const outputParser = new JsonOutputFunctionsParser();

      // 3. Define the output json schema
      const outputJsonSchema = {
        name: 'generate_jd',
        description: 'Generates Job Description',
        parameters: {
          type: 'object',
          properties: {
            jd: {
              type: 'string',
              description: 'The job description html format string.',
            },
          },
        },
      };

      // 4. Get the Prompt Template
      const promptTemplate = promptGenerateJd();

      // 5. Define the chain
      const chain = promptTemplate.pipe(
        model
          .bind({
            functions: [outputJsonSchema],
            function_call: { name: 'generate_jd' },
          })
          .pipe(outputParser),
      );

      // 6. Get the result
      const resultMap = (await chain.invoke({
        jdInfo: jdInfo,
      })) as Map<string, any>;

      const result = new Map(Object.entries(resultMap));

      return result.get('jd') || '';
    } catch (error) {
      return '';
    }
  }
}
