import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxySmartRanking } from 'src/proxyrmq/proxyrmq.service';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';

@Controller('api/v1/players')
export class PlayersController {
    private readonly logger = new Logger(PlayersController.name);
    constructor(
        private readonly clientProxySmartRanking: ClientProxySmartRanking,
        private readonly awsService: AwsService,
    ) {}

    private readonly clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminInstance();

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getPlayers(@Query('id') id: string): Observable<any> {
        return this.clientAdminBackend.send('get-players', id ? id : '');
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file, @Param('id') id: string) {
        const player = await this.clientAdminBackend
            .send('get-players', id)
            .toPromise();

        if (!player) {
            throw new BadRequestException('Jogador não encontrado');
        }

        const data = await this.awsService.uploadFile(file, id);

        const updatePlayerDto: UpdatePlayerDto = {
            ...player,
            urlPhoto: data.url,
        };

        this.clientAdminBackend.emit('update-player', {
            player: updatePlayerDto,
            id,
        });

        return this.clientAdminBackend.send('get-players', id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto,
    ): Promise<void> {
        const { category } = createPlayerDto;
        const categoryExists = await this.clientAdminBackend
            .send('get-categories', category)
            .toPromise();

        if (!categoryExists) {
            throw new BadRequestException('Categoria não cadastrada');
        }
        this.clientAdminBackend.emit('create-player', createPlayerDto);
    }

    @UseGuards(AuthGuard('jwt'))
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

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deletePlayer(@Param('id') id: string) {
        this.clientAdminBackend.emit('delete-player', id);
    }
}
