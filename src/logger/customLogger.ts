/* eslint-disable-no-console */
import * as consts from 'consts'
import cuid from 'cuid'
import * as config from 'config'
import { postLogToBubbleBackend, postLogToDappHeroBackend } from 'api/dappHero'

export const sendLogsToConsole = (json: any): void => {
  try {
    const { level, epoch, deviceId, isAnalytics, projectId, timestamp, message, ...restOfJson } = json
    if (restOfJson && window?.dappHero?.debug) {
      const logItems = restOfJson && Object.entries(restOfJson).map(([ key, value ]) => [ `${key}: ${value}`, '\n' ]).flat(1)
      if (message) {
        console.log(message, '\n', ...logItems)
      } else {
        console.log(...logItems)
      }
    }
  } catch (err) {
    console.log('There was a problem logging to the console')
  }
}
export class DappHeroLogger {

  private isPublic: boolean
  private isDebug: boolean
  private isPrivate: boolean
  private isAnalytics: boolean

  private public: DappHeroLogger
  private debug: DappHeroLogger
  private private: DappHeroLogger
  private analytics: DappHeroLogger

  private token = consts.loggly.token

  constructor({ isPublic = false, isDebug = false, isPrivate = false, isAnalytics = false } = {}) {

    this.isPublic = isPublic
    this.isDebug = isDebug
    this.isPrivate = isPrivate
    this.isAnalytics = isAnalytics

    this.private = (isPrivate || isDebug || isPublic ) ? null : new DappHeroLogger({ isPublic, isDebug, isPrivate: true, isAnalytics })
    this.debug = (isDebug || isPrivate || isPublic ) ? null : new DappHeroLogger({ isPublic, isDebug: true, isPrivate, isAnalytics })
    this.public = (isDebug || isPrivate || isPublic ) ? null : new DappHeroLogger({ isPublic: true, isDebug, isPrivate, isAnalytics })
    this.analytics = isAnalytics ? null : new DappHeroLogger({ isPrivate: true, isDebug, isPublic, isAnalytics: true })
  }

  private orchestrateLogging = (level, message, obj): void => {
    const json = this.formatPayload(level, message, obj)

    // Determine if logs should be sent to console
    // switch (true) {
    //   case (this.isPublic): {
    //     sendLogsToConsole(json)
    //     break
    //   }
    //   case (window.dappHero?.debug): {
    //     sendLogsToConsole(json)
    //     break
    //   }
    //   default: break
    // }
    sendLogsToConsole(json)

    // Send logs to bubble backend for analytics
    if (this.isAnalytics) postLogToBubbleBackend(json)

    // Log to dapphero backend
    postLogToDappHeroBackend(json)
  }

  private formatPayload = (level, message, json): { [key: string]: any } => {
    const timestamp = new Date()
    const jsonMessage = json?.message ?? null

    const defaultPayload = {
      level,
      id: cuid(),
      deviceId: config.app.deviceId,
      isAnalytics: !!this.isAnalytics,
      projectId: consts.global.apiKey,
      timestamp: timestamp.toString(),
      epoch: timestamp.getTime(),
    }
    if (json && json.toString() !== '[object Object]') {
      return {
        ...json,
        ...defaultPayload,
        message: typeof message === 'string' ? message : (jsonMessage ?? null),
      }
    }
    return {
      ...defaultPayload,
      message: typeof message === 'string' ? message : (jsonMessage ?? null),
    }
  }

  log = (message, json: Record<string, any> = null): void => {
    this.orchestrateLogging('debug', message, json)
  }

  info = (message, json: Record<string, any> = null): void => {
    this.orchestrateLogging('info', message, json)
  }

  warn = (message, json: Record<string, any> = null ): void => {
    this.orchestrateLogging('warn', message, json)
  }

  error = (message, json: Record<string, any> = null): void => {
    this.orchestrateLogging('error', message, json)
  }
}

export const logger = new DappHeroLogger()
