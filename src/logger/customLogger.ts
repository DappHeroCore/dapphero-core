import { createLogger, format, transports } from 'winston'

export const winstonLogger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(),
  ),
})

export class DappHeroLogger {
  private winstonLogger = winstonLogger

  debug = (...params) => {
    console.log(...params) // eslint-disable-line
    // const stingifiedParams = params.map((item) => {
    //   try {
    //     return JSON.stringify(item, null, 2)
    //   } catch {
    //     return item.toString()
    //   }
    // })
    // this.winstonLogger.debug(stingifiedParams.join(' '))
  }

  log = (first, message, callback) => this.winstonLogger.log(first, message, callback)

  info = (first, ...rest) => this.winstonLogger.info(first, ...rest)

  warn = (first, ...rest) => this.winstonLogger.warn(first, ...rest)

  error = (first, ...rest) => this.winstonLogger.error(first, ...rest)

}

export const logger = new DappHeroLogger()
