import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from './interfaces/category.schema';
import { PlayerSchema } from '../players/interfaces/player.schema';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Players', schema: PlayerSchema },
      { name: 'Categories', schema: CategorySchema },
    ]),
  ],
})
export class CategoriesModule {}
