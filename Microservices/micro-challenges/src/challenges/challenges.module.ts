import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeSchema } from './interfaces/challenge.schema';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenges', schema: ChallengeSchema },
    ]),
  ],
})
export class ChallengesModule {}
