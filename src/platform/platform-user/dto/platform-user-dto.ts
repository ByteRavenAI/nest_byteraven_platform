import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePlatformUserDto {
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsString({ message: 'Creation date is required in ISO Date Time Format' })
  createdAt: string;

  @IsString({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Last name is required' })
  lastName: string;

  @IsOptional()
  @IsString()
  dpUrl: string;
}

export class GetPlatformUserViaEmailDto {
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;
}

export class GetPlatformUserViaIdDto {
  @IsString({ message: 'platformUserId is required' })
  platformUserId: string;
}

export class GetJwtForPlatformUserDto {
  @IsString({ message: 'platformUserId is required' })
  platformUserId: string;
}
