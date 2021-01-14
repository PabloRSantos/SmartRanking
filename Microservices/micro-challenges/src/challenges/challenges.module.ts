import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeSchema } from './interfaces/challenge.schema';

@Module({
    controllers: [ChallengesController],
    providers: [ChallengesService],
    imports: [
        ProxyrmqModule,
        MongooseModule.forFeature([
            { name: 'Challenges', schema: ChallengeSchema },
        ]),
    ],
})
export class ChallengesModule {}
