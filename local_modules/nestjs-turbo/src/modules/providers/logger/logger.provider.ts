import { ApplicationTokens } from "../../application-tokens.const";
import { PinoLogger as Logger } from "nestjs-pino";

export const LoggerProvider = {
    provide: ApplicationTokens.LoggerToken,
    useExisting: Logger
};
