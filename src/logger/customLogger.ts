import * as consts from 'consts'
import Axios from 'axios'

export class DappHeroLogger {
  private axios = Axios.create({ headers: { 'content-type': 'application/json' } })

  private token = consts.loggly.token

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

  private post = (level, ...params) => {
    const timestamp = new Date().toString()
    const json = {
      level,
      timestamp,
      message: params.length === 1 ? params[0] : this.stringifyParams(params),
    }
    return this.axios({
      method: 'post',
      url: `http://dh-logging-dev.cfhmrmuygw.us-east-1.elasticbeanstalk.com/log`,
      data: JSON.stringify(json),
    }).catch((e) => {})
  }

  debug = (...params) => {
    console.log(...params) // eslint-disable-line
    this.post('debug', ...params)
  }

  log = (level, ...rest) => {
    if ([ 'debug', 'info', 'warn', 'error' ].includes(level)) {
      this[level](...rest)
    } else {
      this.info(...rest)
    }
  }

  info = (...params) => {
    console.info(...params)
    this.post('info', ...params)
  }

  warn = (...params) => {
    console.warn(...params)
    this.post('warn', ...params)
  }

  error = (...params) => {
    console.error(...params)
    this.post('error', ...params)
  }
}

export const logger = new DappHeroLogger()

