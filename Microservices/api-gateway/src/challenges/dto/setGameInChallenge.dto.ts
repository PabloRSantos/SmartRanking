import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/game.interface';

export class SetGameInChallengeDto {
    @IsNotEmpty()
    def: Player;

    @IsNotEmpty()
    result: Array<Result>;
}
