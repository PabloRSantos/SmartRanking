import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayersModule } from './players/players.module';
import { AwsModule } from './aws/aws.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
    imports: [CategoryModule, PlayersModule, AwsModule, ChallengesModule],
})
export class AppModule {}
