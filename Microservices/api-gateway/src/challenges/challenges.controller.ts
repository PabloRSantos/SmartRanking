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
import { ClientProxySmartRanking } from 'src/proxyrmq/proxyrmq.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { SetGameInChallengeDto } from './dto/setGameInChallenge.dto';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challengeStatus.enum';
import { Game } from './interfaces/game.interface';
import { ChallengeStatusValidationPipe } from './pipes/ChallengeStatusValidation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
    constructor(private readonly clientProxy: ClientProxySmartRanking) {}

    private clientChallengesBackend = this.clientProxy.getClientProxyChallengesIstance();
    private clientAdminBackend = this.clientProxy.getClientProxyAdminInstance();

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
        const { players, category, requester } = createChallengeDto;

        const playersModel = [];
        playersModel[0] = await this.clientAdminBackend
            .send('get-players', players[0])
            .toPromise();

        playersModel[1] = await this.clientAdminBackend
            .send('get-players', players[1])
            .toPromise();

        if (!playersModel.length) {
            throw new BadRequestException(`Algum dos jogadores não existe`);
        }

        const playersWrongCategory = playersModel.filter(
            (player) => player.category.toString() !== category,
        );

        if (playersWrongCategory.length) {
            throw new BadRequestException(
                'Algum dos jogadores não esta cadastrado na categoria',
            );
        }

        const requesterIsAPlayer = players.filter(
            (player) => player._id === requester,
        );

        if (!requesterIsAPlayer) {
            throw new BadRequestException(
                'O Solicitante do desafio deve participar do desafio',
            );
        }

        const categoryExist = await this.clientAdminBackend
            .send('get-categories', category)
            .toPromise();

        if (!categoryExist) {
            throw new BadRequestException('A categoria não existe');
        }

        this.clientChallengesBackend.emit(
            'create-challenge',
            createChallengeDto,
        );
    }

    @Get()
    async getChallenges(@Query('playerId') playerId: string) {
        if (playerId) {
            const playerExist = await this.clientAdminBackend
                .send('get-players', playerId)
                .toPromise();

            if (!playerExist) {
                throw new BadRequestException('Jogador não encontrado');
            }
        }

        return this.clientChallengesBackend.send('get-challenges', {
            playerId,
            challengeId: '',
        });
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async updateChallenge(
        @Param('id') id: string,
        @Body(ChallengeStatusValidationPipe)
        updateChallengeDto: UpdateChallengeDto,
    ) {
        const challengeExist: Challenge = await this.clientChallengesBackend
            .send('get-challenges', { challengeId: id, playerId: '' })
            .toPromise();

        if (!challengeExist) {
            throw new BadRequestException('Desafio não existe');
        }

        if (challengeExist.status != ChallengeStatus.PENDENTE) {
            throw new BadRequestException(
                'Somente desafios com o status PENDENTE podem ser atualizados',
            );
        }

        this.clientChallengesBackend.emit('update-challenge', {
            challenge: updateChallengeDto,
            id,
        });
    }

    @Delete('/:id')
    async deleteChallenge(@Param('id') id: string) {
        const challengeExist = await this.clientChallengesBackend
            .send('get-challenges', { playerId: '', challengeId: id })
            .toPromise();

        if (!challengeExist) {
            throw new BadRequestException('Desafio não existe');
        }
        this.clientChallengesBackend.emit('delete-challenge', id);
    }

    @Post('/:id/game')
    @UsePipes(ValidationPipe)
    async setGameInChallenge(
        @Param('id') id: string,
        @Body() setGameInChallengeDto: SetGameInChallengeDto,
    ) {
        const { def, result } = setGameInChallengeDto;
        const challengeExist: Challenge = await this.clientChallengesBackend
            .send('get-challenges', { playerId: '', challengeId: id })
            .toPromise();

        if (!challengeExist) {
            throw new BadRequestException('Desafio não existe');
        }

        if (challengeExist.status === ChallengeStatus.REALIZADO) {
            throw new BadRequestException('Desafio já realizado');
        }

        if (challengeExist.status != ChallengeStatus.ACEITO) {
            throw new BadRequestException('Desafio não está aceito');
        }

        const defExist = challengeExist.players.filter(
            (player) => player === def,
        );

        if (!defExist) {
            throw new BadRequestException('Vencedor não faz parte do desafio');
        }

        const game: Game = {
            category: challengeExist.category,
            def,
            challenge: id,
            players: challengeExist.players,
            result,
        };

        this.clientChallengesBackend.emit('create-game', game);
    }
}
