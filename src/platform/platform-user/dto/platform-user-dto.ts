import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

// Request DTOs
export class CreatePlatformUserDto {
  @IsEmail({}, { message: 'A valid email is required' })
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString({ message: 'Creation date is required in ISO Date Time Format' })
  @ApiProperty({
    description: 'Time of user creation in ISO Date Time String Format',
  })
  createdAt: string;

  @IsString({ message: 'First name is required' })
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @IsString({ message: 'Last name is required' })
  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Profile Picture URL of the user' })
  dpUrl: string;
}

export class GetPlatformUserViaEmailDto {
  @IsEmail({}, { message: 'A valid email is required' })
  @ApiProperty({ description: 'Email of the user' })
  email: string;
}

export class GetPlatformUserViaIdDto {
  @IsString({ message: 'platformUserId is required' })
  @ApiProperty({ description: 'Platform user id of the user' })
  platformUserId: string;
}

export class GetJwtForPlatformUserDto {
  @IsString({ message: 'platformUserId is required' })
  @ApiProperty({ description: 'Platform user id of the user' })
  platformUserId: string;

  @IsEmail({}, { message: 'A valid email is required' })
  @ApiProperty({ description: 'Email of the user' })
  email: string;
}

// Response DTOs

export class PlatformUserResponseDto {
  @ApiProperty({ description: 'Platform User ID' })
  platformUserId: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({
    description: 'Time of user creation in ISO Date Time String Format',
  })
  createdAt: string;

  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({ description: 'Profile Picture URL of the user' })
  dpUrl: string;
}


export class PlatformUserJwtResponseDto {
  @ApiProperty({ description: 'JWT Token' })
  jwt: string;
} 
