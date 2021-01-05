import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayersModule } from 'src/players/players.module';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { challengeSchema } from './interfaces/challenge.schema';
import { gameSchema } from './interfaces/game.schema';

@Module({
  imports: [
    PlayersModule,
    CategoriesModule,
    MongooseModule.forFeature([
      { name: 'Challenges', schema: challengeSchema },
      { name: 'Games', schema: gameSchema },
    ]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
