import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';
import { Player } from './interfaces/player.interface';
import { ProxyrmqService } from './proxyrmq/proxyrmq.service';
import { HTML_NOTIFICATION_OPONENT } from './static/html-notification-oponent';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly clientProxy: ProxyrmqService,
  ) {}

  private readonly adminClient = this.clientProxy.getClientProxyAdminInstance();

  async sendEmailToOponent(challenge: Challenge): Promise<void> {
    try {
      const { requester, players } = challenge;

      const filteredPlayerId = players.filter((player) => player !== requester);

      const opponentEmail: Player = await this.adminClient
        .send('get-players', filteredPlayerId)
        .toPromise();

      const requesterEmail: Player = await this.adminClient
        .send('get-players', requester)
        .toPromise();

      const markup = HTML_NOTIFICATION_OPONENT.replace(
        /#OPONENT_NAME/g,
        opponentEmail.name,
      ).replace(/#REQUESTER_NAME/g, requesterEmail.name);

      this.mailerService
        .sendMail({
          to: opponentEmail.email,
          from: 'smartranking@gmail.com',
          subject: 'Notificação de desafio',
          html: markup,
        })
        .catch((err) => this.logger.error(err));
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}
