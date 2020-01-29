import * as consts from 'consts'
import Axios from 'axios'

export class DappHeroLogger {
  private axios = Axios.create({ headers: { 'content-type': 'application/json' } })

  private token = consts.loggly.token

  private stringifyParams = (params) => {
    const stringifiedParams = params.map((item) => {
      try {
        return JSON.stringify(item, null, 2)
      } catch {
        return item.toString()
      }
    })
    return stringifiedParams
  }

  debug = (...params) => {
    console.log(...params) // eslint-disable-line
    const json = {
      level: 'debug',
      timestamp: new Date().toString(),
      message: params.length === 1 ? params[0] : this.stringifyParams(params),
    }
    this.axios({
      method: 'post',
      url: `http://logs-01.loggly.com/inputs/${this.token}/tag/http/`,
      data: JSON.stringify(json),
    }).catch((e) => {})
  }

  log = (level, ...rest) => {
    const json = {
      level,
      timeStamp: new Date().toString(),
      message: rest.length === 1 ? rest[0] : this.stringifyParams(rest),
    }
    this.axios.post(`http://logs-01.loggly.com/inputs/${this.token}/tag/http/`, json).catch((e) => {})
  }

  info = (...params) => {
    const json = {
      level: 'info',
      timestamp: new Date().toString(),
      message: params.length === 1 ? params[0] : this.stringifyParams(params),
    }
    this.axios({
      method: 'post',
      url: `http://logs-01.loggly.com/inputs/${this.token}/tag/http/`,
      data: JSON.stringify(json),
    }).catch((e) => {})
  }

  warn = (...params) => {
    const json = {
      level: 'warn',
      timestamp: new Date().toString(),
      message: params.length === 1 ? params[0] : this.stringifyParams(params),
    }
    this.axios({
      method: 'post',
      url: `http://logs-01.loggly.com/inputs/${this.token}/tag/http/`,
      data: JSON.stringify(json),
    }).catch((e) => {})
  }

  error = (...params) => {
    const json = {
      level: 'error',
      timestamp: new Date().toString(),
      message: params.length === 1 ? params[0] : this.stringifyParams(params),
    }
    this.axios({
      method: 'post',
      url: `http://logs-01.loggly.com/inputs/${this.token}/tag/http/`,
      data: JSON.stringify(json),
    }).catch((e) => {})
  }

}

export const logger = new DappHeroLogger()

