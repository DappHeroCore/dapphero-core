
export class Logger {
  public debug = (...params) => console.log(...params)
}

export const logger = new Logger()
