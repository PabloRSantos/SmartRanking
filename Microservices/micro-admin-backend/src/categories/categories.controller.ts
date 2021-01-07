import { Controller, Logger } from '@nestjs/common';
import {
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = [];

@Controller()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    private readonly logger = new Logger(CategoriesController.name);

    @EventPattern('create-category')
    async createCategory(
        @Payload() category: Category,
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this.categoriesService.createCategory(category);
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

    @EventPattern('update-category')
    async updateCategory(
        @Payload() data: { category: Category; id: string },
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const { id, category } = data;

            await this.categoriesService.updateCategory(id, category);
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

    @MessagePattern('get-categories')
    async getCategories(@Payload() id: string, @Ctx() context: RmqContext) {
        const originalMessage = context.getMessage();
        const channel = context.getChannelRef();
        try {
            if (id) {
                return await this.categoriesService.getCategoryById(id);
            } else {
                return await this.categoriesService.getAllCategories();
            }
        } finally {
            await channel.ack(originalMessage);
        }
    }
}
