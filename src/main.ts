import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {AllExceptionsFilter} from "./system/filters/all-exception.filter";
import {TypeORMExceptionFilter} from "./system/filters/typeorm-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter), new TypeORMExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
