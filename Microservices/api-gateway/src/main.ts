import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/httpException.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(8080);
}
bootstrap();
