import { Controller } from '@nestjs/common';
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000'];

@Controller('challenges')
export class ChallengesController {
    constructor(private readonly challengeService: ChallengesService) {}

    @EventPattern('create-challenge')
    async createChallenge(
        @Payload() challenge: Challenge,
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this.challengeService.createChallenge(challenge);
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErrors.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @MessagePattern('get-challenges')
    async getChallenges(
        @Payload() data: { playerId: string; challengeId: string },
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        try {
            if (data.playerId) {
                return await this.challengeService.getChallengeOfPlayer(
                    data.playerId,
                );
            } else if (data.challengeId) {
                return await this.challengeService.getChallengeById(
                    data.challengeId,
                );
            }

            console.log('oi');

            return await this.challengeService.getAllChallenges();
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('update-challenge')
    async updateChallenge(
        @Payload() data: { challenge: Challenge; id: string },
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const { challenge, id } = data;
            await this.challengeService.updateChallenge(challenge, id);
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErrors.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @EventPattern('delete-challenge')
    async deleteChallenge(@Payload() id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this.challengeService.deleteChallenge(id);
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErrors.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @EventPattern('update-game-challenge')
    async updateGameChallenge(
        @Payload() data: any,
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const { id, challenge } = data;

            await this.challengeService.updateGameChallenge(id, challenge);
            await channel.ack(originalMessage);
        } catch (error) {
            const filteredAckError = ackErrors.filter((ackError) =>
                error.message.includes(ackError),
            );

            if (filteredAckError) {
                await channel.ack(originalMessage);
            }
        }
    }

    @MessagePattern('get-challenges-realizeds')
    async getRealizedChallenges(
        @Payload() data: { categoryId: string; dateRef: string },
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            const { categoryId, dateRef } = data;

            if (dateRef) {
                return await this.challengeService.getRealizedChallengesByDate(
                    categoryId,
                    dateRef,
                );
            } else {
                return await this.challengeService.getRealizedChallenges(
                    categoryId,
                );
            }
        } finally {
            await channel.ack(originalMsg);
        }
    }
}
