import * as config from 'config';

export function getConfig<ConfigT>(key: string, fallback?: ConfigT): ConfigT {
  let result: ConfigT;
  try {
    result = config.get(key);
  }
  catch (error) {
    if (fallback === undefined) {
      throw error;
    }
    result = fallback;
  }

  return result;
}
