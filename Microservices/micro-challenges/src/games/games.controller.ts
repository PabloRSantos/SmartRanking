import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { GamesService } from './games.service';
import { Game } from './interfaces/game.interface';

const ackErros: string[] = [];

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @EventPattern('create-game')
  async createGame(@Payload() game: Game, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.gameService.createGame(game);
      await channel.ack(originalMessage);
    } catch (error) {
      const filteredAckError = ackErros.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filteredAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
