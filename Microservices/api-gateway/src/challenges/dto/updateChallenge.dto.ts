import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';

export class UpdateChallengeDto {
    @IsOptional()
    status: ChallengeStatus;
}
