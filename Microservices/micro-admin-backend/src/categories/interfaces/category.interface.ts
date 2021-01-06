import { Document } from 'mongoose';
// import { Player } from '../players/player.interface';

export interface Category extends Document {
    readonly _id: string;
    readonly category: string;
    description: string;
    event: Array<Event>;
    //   players: Array<Player>;
}

export interface Event {
    name: string;
    operation: string;
    value: number;
}
