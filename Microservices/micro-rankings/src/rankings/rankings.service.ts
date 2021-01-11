import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProxyrmqService } from 'src/proxyrmq/client-proxy';
import { Category } from './interfaces/category.interface';
import { EventName } from './interfaces/event-name.enum';
import { Game } from './interfaces/game.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { Ranking } from './interfaces/ranking.schema';
import * as momentTimeZone from 'moment-timezone';
import { Challenge } from './interfaces/challenge.interface';
import * as _ from 'lodash';

@Injectable()
export class RankingsService {
  private readonly logger = new Logger(RankingsService.name);

  constructor(
    @InjectModel('Rankings') private readonly rankingModel: Model<Ranking>,
    private clientProxy: ProxyrmqService,
  ) {}

  private adminClient = this.clientProxy.getClientProxyAdminInstance();
  private challengesClient = this.clientProxy.getClientProxyChallengesIstance();

  async gameProcess(id: string, game: Game): Promise<void> {
    try {
      const category: Category = await this.adminClient
        .send('get-categories', game.category)
        .toPromise();

      await Promise.all(
        game.players.map(async (player) => {
          const ranking = new this.rankingModel();

          ranking.category = game.category;
          ranking.challenge = game.challenge;
          ranking.game = id;
          ranking.player = player;

          if (player === game.def) {
            const eventFilter = category.events.filter(
              (event) => event.name === EventName.VITORIA,
            );
            ranking.event = EventName.VITORIA;
            ranking.points = eventFilter[0].value;
            ranking.operation = eventFilter[0].operation;
          } else {
            const eventFilter = category.events.filter(
              (eventItem) => eventItem.name === EventName.DERROTA,
            );
            ranking.event = EventName.DERROTA;
            ranking.points = eventFilter[0].value;
            ranking.operation = eventFilter[0].operation;
          }

          await ranking.save();
        }),
      );
    } catch (error) {
      this.logger.log('a');
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async getRanking(
    categoryId: string,
    dateRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      if (!dateRef) {
        dateRef = momentTimeZone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
      }

      const rankingInfos = await this.rankingModel.find({
        category: categoryId,
      });

      const challenges: Challenge[] = await this.challengesClient
        .send('get-challenges-realizeds', { categoryId, dateRef })
        .toPromise();

      _.remove(rankingInfos, function (item: Ranking) {
        return (
          challenges.filter((challenge) => challenge._id !== item.challenge)
            .length == 0
        );
      });

      const result = _(rankingInfos)
        .groupBy('player')
        .map((items: any, key) => ({
          player: key,
          history: _.countBy(items, 'event'),
          points: _.sumBy(items, 'points'),
        }))
        .value();

      const sortResult: any[] = _.orderBy(result, 'points', 'desc');

      const rankingResponseList: any = sortResult.map((item, index) => {
        return {
          player: item.player,
          position: index + 1,
          punctuation: item.points,
          gamesHistoric: {
            victories: item.history.VITORIA ? item.history.VITORIA : 0,
            defeats: item.history.DERROTA ? item.history.DERROTA : 0,
          },
        };
      });

      return rankingResponseList;
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error.message);
    }
  }
}
