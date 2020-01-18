export class Logger {
  public debug = (...params) => {
    if (process.env.NODE_ENV === 'development') console.log(...params)
  }
}

export const logger = new Logger()
