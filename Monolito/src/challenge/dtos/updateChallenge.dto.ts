import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';

export class UpdateChallengeDto {
  @IsOptional()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsOptional()
  @IsString()
  status: ChallengeStatus;
}
