import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  getClientProxyAdminInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:2suCtsau5xe1@3.89.129.202:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }
}
