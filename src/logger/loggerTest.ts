// Log tests and Startup Logs
import { logger } from './customLogger'

export const loggerTest = () => {
  logger.log('info', 'The logger.log function')
  logger.debug('The logger.debug function', 'is working')
  logger.info('The logger.info function', 'is working')
  logger.warn('The logger.warn function', 'is working')
  logger.error('The logger.error function', 'is working')
  const infoObj = {
    anArray: [
      '1', { message: 'Log an Object' },
    ],
    aString: 'lorem ipsum',
    anObject: { key1: 'value1' },
  }
  logger.info('Test Object: ', infoObj)
}
