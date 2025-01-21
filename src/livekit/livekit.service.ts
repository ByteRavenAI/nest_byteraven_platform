import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

const configLivekitApiKey = process.env.LIVEKIT_APIKEY;
const configLivekitApiSecret = process.env.LIVEKIT_SECRET;
const configLivekitBaseUrl = process.env.LIVEKIT_HOST;

interface LiveKitSessionConfigInterface {
  instructions?: string;
  openaiApiKey?: string;
  voice?: string;
  temperature?: number;
  maxOutputTokens?: number;
  modalities?: string[];
  turnDetection?: any;
  screeningJobId: string;
  screeningSubmissionId: string;
}

@Injectable()
export class LivekitService {
  constructor() {}

  // Helper function to create a JWT for LiveKit API requests
  createLiveKitJWT = (
    roomName: string,
    identity = '',
    roomJoin: boolean,
    roomCreate: boolean,
    canPublish: boolean,
    canSubscribe: boolean,
    currDateTime: number,
    metadata?: LiveKitSessionConfigInterface,
  ) => {
    const payload = {
      exp: currDateTime + 86400,
      iss: configLivekitApiKey,
      sub: identity,
      nbf: currDateTime,
      video: {
        room: roomName,
        roomJoin,
        roomCreate,
        canPublish,
        canSubscribe,
      },
      metadata: JSON.stringify(metadata),
    };

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    return jwt.sign(payload, configLivekitApiSecret || '', {
      header,
    });
  };

  // Function to generate a participant token using REST API
  createLiveKitParticipantTokenService = async (
    roomName: string,
    participantName: string,
    currDateTime: number,
    livekitConfig: LiveKitSessionConfigInterface,
  ) => {
    try {
      const token = this.createLiveKitJWT(
        roomName,
        participantName,
        true,
        true,
        true,
        true,
        currDateTime,
        livekitConfig,
      );

      const roomGenerationToken = this.createLiveKitJWT(
        roomName,
        '',
        true,
        true,
        true,
        true,
        currDateTime,
      );

      const response = await axios.post(
        configLivekitBaseUrl || '',
        {
          name: roomName,
          max_participants: 4,
          empty_timeout: 10 * 60,
        },
        {
          headers: {
            Authorization: `Bearer ${roomGenerationToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return token;
    } catch (error) {
      console.error('Error creating LiveKit participant token:', error);
      return '';
    }
  };
}
