import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [CategoryModule, PlayersModule],
})
export class AppModule {}
