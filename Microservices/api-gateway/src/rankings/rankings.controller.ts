import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/proxyrmq.service';

@Controller('api/v1/rankings')
export class RankingsController {
    constructor(private clientProxy: ClientProxySmartRanking) {}

    private rankingClient = this.clientProxy.getClientProxyRankingsIstance();

    @Get()
    getRanking(
        @Query('categoryId') categoryId: string,
        @Query('dateRef') dateRef: string,
    ): Observable<any> {
        if (!categoryId) {
            throw new BadRequestException('O id da categoria é obrigatório');
        }

        return this.rankingClient.send('get-ranking', {
            categoryId,
            dateRef: dateRef ? dateRef : '',
        });
    }
}
