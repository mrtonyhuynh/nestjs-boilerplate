import * as log from "pino";

export function getLogger(level: string = 'debug') {
  return log({
    // config
    level
  });
}
