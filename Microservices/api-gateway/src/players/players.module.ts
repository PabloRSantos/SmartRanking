import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';

@Module({
  controllers: [PlayersController],
  imports: [ProxyrmqModule],
})
export class PlayersModule {}
