import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProxyrmqService } from 'src/proxyrmq/proxyrmq.service';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challengeStatus.enum';

@Injectable()
export class ChallengesService {
    private readonly logger = new Logger(ChallengesService.name);

    constructor(
        @InjectModel('Challenges')
        private readonly challengeModel: Model<Challenge>,
        private readonly clientProxy: ProxyrmqService,
    ) {}

    private readonly notificationsClient = this.clientProxy.getClientProxyNotificationsIstance();

    async createChallenge(challenge: Challenge): Promise<Challenge> {
        try {
            const newChallenge = new this.challengeModel(challenge);
            newChallenge.status = ChallengeStatus.PENDENTE;
            await newChallenge.save();

            return await this.notificationsClient
                .emit('notification-new-challenge', challenge)
                .toPromise();
        } catch (error) {
            this.logger.error(error.message);
            throw new RpcException(error.message);
        }
    }

    async getChallengeById(challengeId: string): Promise<Challenge> {
        try {
            return await this.challengeModel
                .findById(challengeId)
                .populate('game');
        } catch (error) {
            this.logger.error(error.message);
            throw new RpcException(error.message);
        }
    }

    async getChallengeOfPlayer(playerId: string): Promise<Array<Challenge>> {
        try {
            return await this.challengeModel
                .find()
                .where('players')
                .in([playerId])
                .populate('game');
        } catch (error) {
            this.logger.error(error.message);
            throw new RpcException(error.message);
        }
    }

    async getAllChallenges(): Promise<Array<Challenge>> {
        try {
            return await this.challengeModel.find().populate('game');
        } catch (error) {
            this.logger.error(error.message);
            throw new RpcException(error.message);
        }
    }

    async getRealizedChallenges(categoryId: string): Promise<Array<Challenge>> {
        try {
            return await this.challengeModel.find({
                category: categoryId,
                status: ChallengeStatus.REALIZADO,
            });
        } catch (error) {
            this.logger.error(error);
            throw new RpcException(error.message);
        }
    }

    async getRealizedChallengesByDate(
        categoryId: string,
        dateRef: string,
    ): Promise<Array<Challenge>> {
        try {
            const dateRefNew = new Date(`${dateRef} 23:59:59.999`);
            return await this.challengeModel.find({
                category: categoryId,
                status: ChallengeStatus.REALIZADO,
                dateTimeChallenge: {
                    $lte: dateRefNew,
                },
            });
        } catch (error) {
            this.logger.error(error);
            throw new RpcException(error.message);
        }
    }

    async updateChallenge(challenge: Challenge, id: string): Promise<void> {
        try {
            challenge.dateTimeChallenge = new Date();

            await this.challengeModel.findByIdAndUpdate(id, challenge);
        } catch (error) {
            this.logger.error(error.message);
            throw new RpcException(error.message);
        }
    }

    async updateGameChallenge(
        idGame: string,
        challenge: Challenge,
    ): Promise<void> {
        try {
            challenge.status = ChallengeStatus.REALIZADO;
            challenge.game = idGame;

            console.log(challenge);

            await this.challengeModel.findByIdAndUpdate(
                challenge._id,
                challenge,
            );
        } catch (error) {
            throw new RpcException(error.message);
        }
    }

    async deleteChallenge(id: string): Promise<void> {
        try {
            await this.challengeModel.findByIdAndUpdate(id, {
                status: ChallengeStatus.CANCELADO,
            });
        } catch (error) {
            this.logger.error(error.message);
            throw new RpcException(error.message);
        }
    }
}
