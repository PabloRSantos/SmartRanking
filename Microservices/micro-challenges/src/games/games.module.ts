import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameSchema } from './interfaces/game.schema';

@Module({
  imports: [
    ProxyrmqModule,
    MongooseModule.forFeature([{ name: 'Games', schema: GameSchema }]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
