import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengesController } from './challenges.controller';

@Module({
    controllers: [ChallengesController],
    imports: [ProxyrmqModule],
})
export class ChallengesModule {}
