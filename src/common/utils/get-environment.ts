import * as config from 'config';

export function getEnvironment(): string {
  return config.util.getEnv('NODE_ENV');
}
