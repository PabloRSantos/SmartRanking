import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Game } from './interfaces/game.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { RankingsService } from './rankings.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class RankingsController {
  private readonly logger = new Logger(RankingsController.name);

  constructor(private readonly rankingsSerivce: RankingsService) {}

  @EventPattern('game-process')
  async gameProcess(
    @Payload() data: { id: string; game: Game },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { id, game } = data;

      await this.rankingsSerivce.gameProcess(id, game);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(error);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('get-ranking')
  async getRanking(
    @Payload() data: { categoryId: string; dateRef: string },
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { categoryId, dateRef } = data;

      return await this.rankingsSerivce.getRanking(categoryId, dateRef);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
