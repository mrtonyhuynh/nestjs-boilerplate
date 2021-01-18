import { FactoryProvider } from '@nestjs/common';
import { StaticErrorHandlerConfiguration } from '../../services';

export type ErrorHandlerConfigurationOptions = StaticErrorHandlerConfiguration;
export const ErrorHandlerConfigurationToken = 'ErrorHandlerConfigurationToken';

export function getErrorHandlerConfigurationProvider(optionsFactory: () => ErrorHandlerConfigurationOptions = () => ({
    sanitizeException: true,
    sanitizeStack: {
        enabled: true,
        length: 10000
    }
})): FactoryProvider {
    return {
        provide: ErrorHandlerConfigurationToken,
        useFactory: optionsFactory
    };
}
