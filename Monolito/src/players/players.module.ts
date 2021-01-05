import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './interfaces/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Players', schema: PlayerSchema }]),
  ],
  exports: [PlayersService],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
