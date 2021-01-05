import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';
import { Player } from './interfaces/player.interface';
import { ValidationsParametersPipe } from '../common/pipes/validation_parameters.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('id', ValidationsParametersPipe) id: string,
    @Body() updatePlayerDto: UpdatePlayerDto
  ): Promise<void> {
    await this.playersService.updatePlayer(updatePlayerDto, id);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  @Get('/:id')
  async getPlayerById(
    @Param('id', ValidationsParametersPipe) id: string
  ): Promise<Player> {
    return await this.playersService.getPlayerById(id);
  }

  @Delete('/:id')
  async deletePlayer(
    @Param('id', ValidationsParametersPipe) id: string
  ): Promise<void> {
    await this.playersService.deletePlayer(id);
  }
}
