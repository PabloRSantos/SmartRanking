import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
// import momentTimezone from 'moment-timezone';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/httpException.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    // Date.prototype.toJSON = function (): any {
    //     return momentTimezone(this)
    //         .tz('America/São_Paulo')
    //         .format('YYYY-MM-DD HH:mm:ss.SSS');
    // };

    await app.listen(8080);
}
bootstrap();
