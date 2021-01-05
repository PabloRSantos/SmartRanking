import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dtos/createChallenge.dto';
import { SetGameInChallengeDto } from './dtos/SetGameInChallenge.dto';
import { UpdateChallengeDto } from './dtos/updateChallenge.dto';
import { Challenge, Game } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challengeStatus.enum';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenges')
    private readonly challengeModel: Model<Challenge>,
    @InjectModel('Games')
    private readonly gameModel: Model<Game>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService
  ) {}

  private readonly logger = new Logger(ChallengeService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto
  ): Promise<Challenge> {
    const { players, requester } = createChallengeDto;

    await this.playersService.getPlayerById(players[0]);
    await this.playersService.getPlayerById(players[1]);

    const requesterIsChallenger = players.filter(
      (player) => player === requester
    );

    if (!requesterIsChallenger.length) {
      throw new BadRequestException(
        `O solicitante ${requester} não é um participante do desafio`
      );
    }

    const categoryPlayer = await this.categoriesService.getPlayerCategory(
      requester
    );

    if (!categoryPlayer) {
      throw new BadRequestException(
        `O solicitante ${requester} não esta cadastrado em nenhuma categoria`
      );
    }

    const newChallenge = new this.challengeModel(createChallengeDto);

    newChallenge.category = categoryPlayer.category;

    const date = new Date();
    date.setHours(date.getHours() - 3);
    newChallenge.dateTimeSolicitation = date;

    newChallenge.status = ChallengeStatus.PENDENTE;

    return newChallenge.save();
  }

  async getChallengeOfPlayer(playerId: string): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .where('players')
      .in([playerId])
      .populate(['players', 'requester', 'game']);
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate(['players', 'requester', 'game']);
  }

  async updateChallenge(
    updateChallengeDto: UpdateChallengeDto,
    id: string
  ): Promise<void> {
    const { status, dateTimeChallenge } = updateChallengeDto;
    const challenge = await this.challengeModel.findById(id);

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não encontrado`);
    }

    if (status) {
      const date = new Date();
      date.setHours(date.getHours() - 3);
      challenge.dateTimeAnswer = date;
    }

    challenge.status = status;
    challenge.dateTimeChallenge = dateTimeChallenge;

    await this.challengeModel.findByIdAndUpdate(id, challenge);
  }

  async deleteChallenge(id: string): Promise<void> {
    const challenge = await this.challengeModel.findById(id);

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não cadastrado`);
    }

    await this.challengeModel.findByIdAndUpdate(id, {
      status: ChallengeStatus.CANCELADO,
    });
  }

  async setGameInChallenge(
    setGameInChallengeDto: SetGameInChallengeDto,
    id: string
  ): Promise<void> {
    const { def } = setGameInChallengeDto;
    const challenge = await this.challengeModel.findById(id);

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não encontrado`);
    }

    const playerFilter = challenge.players.filter(
      (player) => player.id === def
    );

    if (!playerFilter) {
      throw new BadRequestException(
        `Jogador ${def._id} não é um participante do desafio`
      );
    }

    const newGame = new this.gameModel(setGameInChallengeDto);

    newGame.category = challenge.category;
    newGame.players = challenge.players;

    const gameResult = await newGame.save();

    challenge.status = ChallengeStatus.REALIZADO;
    challenge.game = gameResult._id;

    try {
      await this.challengeModel.findByIdAndUpdate(id, challenge);
    } catch (error) {
      await this.gameModel.findByIdAndDelete(gameResult._id);
      throw new InternalServerErrorException();
    }
  }
}
