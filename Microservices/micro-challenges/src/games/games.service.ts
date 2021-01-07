import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from 'src/challenges/interfaces/challenge.interface';
import { ProxyrmqService } from 'src/proxyrmq/proxyrmq.service';
import { Game } from './interfaces/game.interface';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel('Games') private readonly gameModel: Model<Game>,
    private readonly clientProxy: ProxyrmqService,
  ) {}

  private readonly clientChallengesBackend = this.clientProxy.getClientProxyChallengesIstance();

  async createGame(game: Game): Promise<Game> {
    try {
      const newGame = new this.gameModel(game);
      const gameResult = await newGame.save();

      const challenge: Challenge = await this.clientChallengesBackend
        .send('get-challenges', {
          challengeId: gameResult.challenge,
          playerId: '',
        })
        .toPromise();

      return await this.clientChallengesBackend
        .emit('update-game-challenge', {
          id: gameResult._id,
          challenge,
        })
        .toPromise();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
