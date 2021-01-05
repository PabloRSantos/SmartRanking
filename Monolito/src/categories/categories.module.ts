import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from './interfaces/category.schema';

@Module({
  imports: [
    PlayersModule,
    MongooseModule.forFeature([{ name: 'Categories', schema: CategorySchema }]),
  ],
  exports: [CategoriesService],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
