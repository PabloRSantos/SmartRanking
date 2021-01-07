import { Controller } from '@nestjs/common';
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { CategoriesService } from 'src/categories/categories.service';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

const ackErros: string[] = [];

@Controller()
export class PlayersController {
    constructor(
        private readonly playersService: PlayersService,
        private readonly categoriesService: CategoriesService,
    ) {}

    @EventPattern('create-player')
    async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const newPlayer = await this.playersService.createPlayer(player);
            await this.categoriesService.addPlayerInCategory(
                player.category,
                newPlayer,
            );
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErros.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @EventPattern('update-player')
    async updatePlayer(
        @Payload() data: { player: Player; id: string },
        @Ctx() context: RmqContext,
    ): Promise<void> {
        const { player, id } = data;
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this.playersService.updatePlayer(player, id);
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErros.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @MessagePattern('get-players')
    async getPlayers(@Payload() id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        try {
            if (id) {
                return await this.playersService.getPlayerById(id);
            } else {
                return await this.playersService.getAllPlayers();
            }
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('delete-player')
    async deletePlayer(@Payload() id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this.playersService.deletePlayer(id);
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErros.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }
}
