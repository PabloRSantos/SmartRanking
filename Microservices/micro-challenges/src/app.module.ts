import { Module } from '@nestjs/common';
import { ChallengesModule } from './challenges/challenges.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { GamesModule } from './games/games.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ChallengesModule,
    ProxyrmqModule,
    GamesModule,
    MongooseModule.forRoot(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }),
  ],
})
export class AppModule {}
