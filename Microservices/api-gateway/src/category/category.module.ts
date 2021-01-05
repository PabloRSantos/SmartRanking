import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  imports: [ProxyrmqModule],
})
export class CategoryModule {}
