import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { Logger } from "nestjs-pino";
import { getConfig, getEnvironment } from "./index";
import {
  CookieToBearer,
  ErrorHandler, LoggedHttpExceptionFilter,
  NodeEventHandler,
  PassiveHttpExceptionFilter,
  RedirectHttpExceptionFilter, setupSwaggerDocs,
  UncaughtExceptionFilter, ValidationPipe
} from "nestjs-turbo";
import { CoreModule } from "../modules/core/core.module";


export async function setup(app){
  const isProduction = getEnvironment() == 'production';
  const coreModule = app.select(CoreModule);

  // Logger
  app.useLogger(coreModule.get(Logger));

  // Handle uncaught exceptions
  const errorHandler = coreModule.get(ErrorHandler);
  NodeEventHandler.handleUnhandledRejection(errorHandler);
  NodeEventHandler.handleUncaughtException(errorHandler);

  // Filter
  app.useGlobalFilters(
    coreModule.get(UncaughtExceptionFilter),
    coreModule.get(PassiveHttpExceptionFilter),
    coreModule.get(RedirectHttpExceptionFilter),
    coreModule.get(LoggedHttpExceptionFilter),
  );

  // Global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Global prefix
  app.setGlobalPrefix(getConfig<string>('application.apiPrefix'));

  // Added security
  app.use(helmet());

  // Body parser
  app.use(
    bodyParser.json({ limit: getConfig<string>('application.bodyParserLimit') }),
  );
  app.use(bodyParser.urlencoded({ extended: false }));

  // Cookie parser
  app.use(cookieParser());

  // Pull Jwt off the cookies and set as the bearer token
  app.use(CookieToBearer);

  // Docs
  if(!isProduction){
    await setupSwaggerDocs(app)
  }
}
