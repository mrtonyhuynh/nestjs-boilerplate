import { PinoLogger as Logger } from "nestjs-pino";
import { Breadcrum } from '../../interfaces';
import { getLogger } from '../../utility';

const DEFAULT_SANITIZE_STACK_LENGTH = 100;

export interface StaticErrorHandlerConfiguration {
  /**
   * Default true
   */
  sanitizeException: boolean;
  sanitizeStack: {
    /**
     * Default true
     */
    enabled: boolean;
    /**
     * Default 10000
     */
    length: number;
  };
}

/**
 * This ErrorHandler works as a static class with an app configured for Raven.  No instance has to be
 * created for this error handler.
 */

export class StaticErrorHandlerService {
  static logger = getLogger();
  static configuration: StaticErrorHandlerConfiguration = {
    sanitizeException: true,
    sanitizeStack: {
      enabled: true,
      length: DEFAULT_SANITIZE_STACK_LENGTH
    }
  };

  static setConfiguration(configuration: StaticErrorHandlerConfiguration) {
    this.configuration = configuration;
  }

  static captureBreadcrumb(breadcrumb: Breadcrum, logger?: Logger) {
    (logger || this.logger).info(breadcrumb.message, breadcrumb.data ? breadcrumb.data : '');
  }

  static captureException(error: Error, logger?: Logger, configuration?: StaticErrorHandlerConfiguration) {
    const sanitizedError = this.sanitizeError(error, configuration);
    sanitizedError.stack = this.sanitizeStack(sanitizedError.stack, configuration);

    (logger || this.logger).error('Error',sanitizedError);
  }

  static captureMessage(message: string, logger?: Logger) {
    (logger || this.logger).info(message);
  }

  private static sanitizeError(originalError: Error, configuration?: StaticErrorHandlerConfiguration) {
    const errorHandlerConfiguration = configuration ?? this.configuration;
    if (errorHandlerConfiguration?.sanitizeException ?? true) {
      const error = new Error(originalError.message);
      error.message = originalError.message;
      error.stack = originalError.stack;
      (error as any).loggedMetadata = (originalError as any).loggedMetadata;
      (error as any).__proto__ = Object.getPrototypeOf(originalError);
      if (originalError.name && originalError.name !== 'Error') {
        error.name = originalError.name;
      }
      // if there isn't a specific name given, clear the name so the constructor name is used
      else {
        // clear the name on the object
        error.name = undefined;
        // remove the key from the error
        delete error.name;
      }
      return error;
    }
    else {
      return originalError;
    }

  }

  private static sanitizeStack(stack: string, configuration?: StaticErrorHandlerConfiguration) {
    const errorHandlerConfiguration = configuration ?? this.configuration;
    if (!stack) {
      return stack;
    }
    if (errorHandlerConfiguration?.sanitizeStack?.enabled ?? true) {
      const length = errorHandlerConfiguration?.sanitizeStack?.length ?? DEFAULT_SANITIZE_STACK_LENGTH;
      if (stack.length < length) {
        return stack;
      }
      else {
        const slimmedStack = stack.slice(0, length);
        const lastLineBreak = slimmedStack.lastIndexOf('\n');
        return slimmedStack.slice(0, lastLineBreak);
      }
    }
    return stack;
  }
}
