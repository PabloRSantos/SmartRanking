import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name);

    constructor(
        @InjectModel('Players') private readonly playerModel: Model<Player>,
    ) {}

    async createPlayer(player: Player): Promise<Player> {
        try {
            const { email } = player;

            const playerExist = await this.playerModel.findOne({ email });

            if (playerExist) {
                throw new BadRequestException(
                    `Jogador com email ${email} já cadastrado`,
                );
            }

            const newPlayer = new this.playerModel(player);
            return await newPlayer.save();
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async updatePlayer(player: Player, id: string): Promise<void> {
        try {
            const playerExist = await this.playerModel.findById(id);

            if (!playerExist) {
                throw new NotFoundException(
                    `Jogador com o id ${id}, não encontrado`,
                );
            }

            await this.playerModel.findByIdAndUpdate(id, player);
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async getAllPlayers(): Promise<Player[]> {
        try {
            return await this.playerModel.find().populate('category');
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async getPlayerById(id: string): Promise<Player> {
        try {
            const player = this.playerModel.findById(id).populate('category');

            if (!player) {
                throw new NotFoundException(
                    `Jogador com o id ${id} não encontrado`,
                );
            }

            return player;
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async deletePlayer(id: string): Promise<void> {
        try {
            const player = await this.playerModel.findById(id);

            if (!player) {
                throw new NotFoundException(
                    `Jogador com o id ${id} não encontrado`,
                );
            }

            await this.playerModel.findByIdAndRemove(id);
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }
}
