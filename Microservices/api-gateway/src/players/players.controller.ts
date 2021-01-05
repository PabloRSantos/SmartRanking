import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/proxyrmq.service';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminInstance();

  @Get()
  getPlayers(@Query('id') id: string): Observable<any> {
    return this.clientAdminBackend.send('get-players', id ? id : '');
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<void> {
    const { category } = createPlayerDto;
    const categoryExists = await this.clientAdminBackend
      .send('get-categories', category)
      .toPromise();

    if (!categoryExists) {
      throw new BadRequestException('Categoria não cadastrada');
    }
    this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    const { category } = updatePlayerDto;
    const categoryExists = await this.clientAdminBackend
      .send('get-categories', category)
      .toPromise();

    if (!categoryExists) {
      throw new BadRequestException('Categoria não cadastrada');
    }

    this.clientAdminBackend.emit('update-player', {
      id,
      player: updatePlayerDto,
    });
  }

  @Delete('/:id')
  deletePlayer(@Param('id') id: string) {
    this.clientAdminBackend.emit('delete-player', id);
  }
}
