import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './proxyrmq.service';

@Module({
    exports: [ClientProxySmartRanking],
    providers: [ClientProxySmartRanking],
})
export class ProxyrmqModule {}
