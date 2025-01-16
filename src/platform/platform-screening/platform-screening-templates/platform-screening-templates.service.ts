import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlatformScreeningTemplatesService {
   constructor(private prisma: PrismaService) {}

   async createScreeningTemplate(dto: CreatePlatformScreeningTemplateDto) {
    try {
      let screeningTemplate: IScreeningTemplate = ScreeningTemplateSchema.parse(
        req.body
      );
  
      screeningTemplate.orgId = req.organisation?.orgId;
      screeningTemplate.orgAlias = req.organisation?.orgAlias;
     
      const orgId = req.organisation?.orgId;
  
      // get all the questions
      const questions: IScreeningTemplateQuestionInterface[] =
        screeningTemplate.questions;
  
      // generate audio from them & save them in the cloud
      for (let i = 0; i < questions.length; i++) {
        const audio = await generateAudioFromTextUsingEllevenLabsService(
          questions[i].question
        );
  
        if (audio != null) {
          const audioFileName = `${uuidv4()}.mp3`;
  
          const uniqueFileName = `organisations/${orgId}/screeningtemplatequestions/${audioFileName}`;
  
          const audioUrl = await uploadFileToS3Service(
            configAwsBucketName || "",
            audio,
            uniqueFileName
          );
  
          if (audioUrl) {
            questions[i].questionAudioUrl = audioUrl.url || "";
          }
  
          deleteFileService(audio ?? "");
        }
      }
  
      const result = await createScreeningTemplateRepo(
        screeningTemplate as IScreeningTemplateInterface
      );
      if (result) {
        res.status(200).json({
          success: true,
          data: result,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to Create Screening Template",
        });
      }
    } catch (error) {
      logger.error("Failed to create screening template " + error);
      res.status(500).json({
        success: false,
        error: "Failed to create Screening Template",
      });
    }
  };
  
}
