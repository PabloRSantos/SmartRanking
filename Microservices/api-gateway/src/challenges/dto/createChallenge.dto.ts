import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsNotEmpty,
} from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';

export class CreateChallengeDto {
    @IsNotEmpty()
    @IsDateString()
    dateTimeChallenge: Date;

    @IsNotEmpty()
    requester: string;

    @IsNotEmpty()
    category: string;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Player[];
}
