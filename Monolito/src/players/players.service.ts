import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Players') private readonly playerModel: Model<Player>
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerExist = await this.playerModel.findOne({ email });

    if (playerExist) {
      throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
    }

    const newPlayer = new this.playerModel(createPlayerDto);

    return await newPlayer.save();
  }

  async updatePlayer(
    updatePlayerDto: UpdatePlayerDto,
    id: string
  ): Promise<void> {
    const playerExist = await this.playerModel.findById(id);

    if (!playerExist) {
      throw new NotFoundException(`Jogador com o id ${id}, não encontrado`);
    }

    await this.playerModel.findByIdAndUpdate(id, updatePlayerDto);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = this.playerModel.findById(id);

    if (!player) {
      throw new NotFoundException(`Jogador com o id ${id} não encontrado`);
    }

    return player;
  }

  async deletePlayer(id: string): Promise<void> {
    const player = await this.playerModel.findById(id);

    if (!player) {
      throw new NotFoundException(`Jogador com o id ${id} não encontrado`);
    }

    await this.playerModel.findByIdAndRemove(id);
  }
}
