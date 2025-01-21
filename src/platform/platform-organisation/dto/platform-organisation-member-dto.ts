import { ApiProperty } from '@nestjs/swagger';
import { OrganisationMemberStatusEnum } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateOrganisationMemberStatusDto {
  @IsString({ message: 'Organisation ID is required' })
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString({ message: 'Organisation Alias is required' })
  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @IsString({ message: 'Platform User ID is required' })
  @ApiProperty({ description: 'Platform User ID' })
  platformUserId: string;

  @IsEmail({}, { message: 'A valid email is required' })
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString({ message: 'First name is required' })
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Last name of the user' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Profile Picture URL of the user' })
  dpUrl?: string;

  @IsString({ message: 'Status is required' })
  @ApiProperty({ description: 'Status of the user' })
  status: OrganisationMemberStatusEnum;

  @IsString({ message: 'Creation date is required in ISO Date Time Format' })
  @ApiProperty({
    description: 'Time of user creation in ISO Date Time String Format',
  })
  createdAt: string;
}

export class GetOrganisationMemberStatusOfUser {
  @IsString({ message: 'Organisation ID is required' })
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString({ message: 'Platform User ID is required' })
  @ApiProperty({ description: 'Platform User ID' })
  platformUserId: string;
}

export class UpdateOrganisationMemberStatusDto {
  @IsString({ message: 'Org Member Status Id' })
  @ApiProperty({ description: 'Platform User ID' })
  orgMemberStatusId: string;

  @IsString({ message: 'Status is required' })
  @ApiProperty({ description: 'Status of the user' })
  status: OrganisationMemberStatusEnum;
}

// Response DTOs

// model OrganisationMemberStatus {
//   id                         String                       @id @default(auto()) @map("_id") @db.ObjectId
//   organisationMemberStatusId String?                     @unique
//   orgId                      String
//   orgAlias                   String
//   platformUserId             String
//   email                      String
//   firstName                  String
//   lastName                   String?
//   dpUrl                      String?
//   status                     OrganisationMemberStatusEnum
//   createdAt                  String
// }

export class GetOrganisationMemberStatusResponseDto {
  @IsString({ message: 'Organisation ID is required' })
  @ApiProperty({ description: 'Organisation ID' })
  orgId: string;

  @IsString({ message: 'Organisation Alias is required' })
  @ApiProperty({ description: 'Organisation Alias' })
  orgAlias: string;

  @IsString({ message: 'Platform User ID is required' })
  @ApiProperty({ description: 'Platform User ID' })
  platformUserId: string;

  @IsEmail({}, { message: 'A valid email is required' })
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString({ message: 'First name is required' })
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Last name of the user' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Profile Picture URL of the user' })
  dpUrl?: string;

  @IsString({ message: 'Status is required' })
  @ApiProperty({ description: 'Status of the user' })
  status: string;

  @IsString({ message: 'Creation date is required in ISO Date Time Format' })
  @ApiProperty({
    description: 'Time of user creation in ISO Date Time String Format',
  })
  createdAt: string;
}

export class GetAllOrganisationMemberStatusOfOrgListResponseDto {
  @ApiProperty({ description: 'Accpeted Members Object List' })
  acceptedMembers: any[];

  @ApiProperty({ description: 'Sent Members Object List' })
  sentMembers: any[];

  @ApiProperty({ description: 'Super Admin' })
  superAdmin: any;
}
