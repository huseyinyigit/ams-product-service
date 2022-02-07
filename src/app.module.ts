import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {SystemModule} from './system/system.module';
import {ProductModule} from './product/product.module';
import typeORMConfig from "./config/db-config";
import {APP_FILTER} from '@nestjs/core';
import {AllExceptionsFilter} from "./system/filters/all-exception.filter";
import {TypeORMExceptionFilter} from "./system/filters/typeorm-exception.filter";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot(typeORMConfig()),
      SystemModule,
      ProductModule
  ],
  controllers: [AppController],
  providers: [
      AppService,
      {
          provide: APP_FILTER,
          useClass: TypeORMExceptionFilter
      },
      {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter
      }
  ],
})
export class AppModule {}
