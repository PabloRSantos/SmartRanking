import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:prs100502@cluster0.yiris.mongodb.net/smartRanking?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    ),
    PlayersModule,
    CategoriesModule,
    ChallengeModule,
  ],
})
export class AppModule {}
