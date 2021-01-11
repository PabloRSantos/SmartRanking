import { Module } from '@nestjs/common';
import { ProxyrmqService } from './client-proxy';

@Module({
  exports: [ProxyrmqService],
  providers: [ProxyrmqService],
})
export class ProxyrmqModule {}
