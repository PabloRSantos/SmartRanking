import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ProxyrmqModule,
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: '',
          password: '',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
