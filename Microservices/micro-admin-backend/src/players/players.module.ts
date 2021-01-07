import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayerSchema } from 'src/players/interfaces/player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
    controllers: [PlayersController],
    providers: [PlayersService],
    imports: [
        CategoriesModule,
        MongooseModule.forFeature([{ name: 'Players', schema: PlayerSchema }]),
    ],
})
export class PlayersModule {}
