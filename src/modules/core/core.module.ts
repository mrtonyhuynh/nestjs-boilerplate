import { CacheModule, Module } from "@nestjs/common";
import {
  ErrorHandler, LoggedHttpExceptionFilter, LoggerProvider,
  PassiveHttpExceptionFilter, RedirectHttpExceptionFilter, UncaughtExceptionFilter
  // RedisService,
  // RedisProvider,
} from 'nestjs-turbo';
import { LoggerModule } from "nestjs-pino";
import * as pino from "pino";
import { getConfig, getEnvironment } from "../../common";

@Module({
  imports:[
    LoggerModule.forRoot({
      pinoHttp: [{
        level: getConfig('logger.level','info')
      }, pino.destination({
        sync: getEnvironment() !== 'production'
      })]
    }),
    CacheModule.register(),
  ],
  providers: [
    ErrorHandler,
    LoggerProvider,
    // RedisService,
    // RedisProvider,
    LoggedHttpExceptionFilter,
    PassiveHttpExceptionFilter,
    UncaughtExceptionFilter,
    RedirectHttpExceptionFilter,
  ]
})
export class CoreModule {}
