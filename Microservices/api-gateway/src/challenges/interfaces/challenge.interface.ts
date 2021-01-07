import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challengeStatus.enum';
import { Game } from './game.interface';

export interface Challenge {
    dateTimeChallenge: Date;
    status: ChallengeStatus;
    dateTimeSolicitation: Date;
    dateTimeAnswer: Date;
    requester: Player;
    category: string;
    players: Array<Player>;
    game?: Game;
}
