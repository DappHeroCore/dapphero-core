/* eslint-disable-no-console */
import * as consts from 'consts'
import Axios from 'axios'
import cuid from 'cuid'

export class DappHeroLogger {
  private axios = Axios.create({ headers: { 'content-type': 'application/json' } })

  private isPrivate: boolean

  private: DappHeroLogger

  private token = consts.loggly.token

  constructor(isPrivate = false) {
    this.isPrivate = isPrivate

    this.private = isPrivate ? null : new DappHeroLogger(true)
  }

  private stringifyParams = (params) => {
    const stringifiedParams = params.map((item) => {
      if (typeof item === 'string') return item
      try {
        return JSON.stringify(item, null, 2)
      } catch {
        return item.toString()
      }
    }).join(' ')
    return stringifiedParams
  }

  private post = async (level, id, ...params) => {
    params.unshift(`dappHeroLogId: ${id}`)
    const timestamp = new Date().toString()
    const json = {
      level,
      id,
      projectId: consts.global.apiKey,
      timestamp,
      message: params.length === 1 ? params[0] : this.stringifyParams(params),
    }
    return this.axios({
      method: 'post',
      url: `https://api.dapphero.io/log`,
      data: JSON.stringify(json),
    }).catch((e) => {
      console.log(e)
    })
  }

  log = (level, ...rest) => {
    if ([ 'debug', 'info', 'warn', 'error' ].includes(level)) {
      this[level](...rest)
    } else {
      this.info(...rest)
    }
  }

  debug = (...params) => {
    const id = cuid()
    if (!this.isPrivate) console.log(`dappHeroLogId: ${id}\n`, ...params)
    this.post('debug', id, ...params)
  }

  info = (...params) => {
    const id = cuid()
    if (!this.isPrivate) console.info(`dappHeroLogId: ${id}\n`, ...params)
    this.post('info', id, ...params)
  }

  warn = (...params) => {
    const id = cuid()
    if (!this.isPrivate) console.warn(`dappHeroLogId: ${id}\n`, ...params)
    this.post('warn', id, ...params)
  }

  error = (...params) => {
    const id = cuid()
    if (!this.isPrivate) console.error(`dappHeroLogId: ${id}\n`, ...params)
    this.post('error', id, ...params)
  }

}

export const logger = new DappHeroLogger()

