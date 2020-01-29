import * as consts from 'consts'
import Axios from 'axios'

const axios = Axios.create({ headers: { 'content-type': 'application/json' } })

axios({
  method: 'post',
  url: 'https://logs-01.loggly.com/inputs/0c02fa85-a311-4c99-9b0b-102b79ef16c2/tag/http/',
  data: JSON.stringify({ message: 'hellofromAxios' }),
})

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
  //   const json = {
  //     message: params.length === 1 ? params[0] : this.stringifyParams(params),
  //     // message: "hello"
  //   }
  //   console.log(JSON.stringify(json))
  //   this.axios({
  //     method: 'post',
  //     url: `http://logs-01.loggly.com/inputs/${this.token}/tag/http/`,
  //     data: JSON.stringify(json),
  //   })
  }

  log = (level, ...rest) => {
    const json = {
      level,
      timeStamp: new Date().toString(),
      message: rest.length === 1 ? rest[0] : this.stringifyParams(rest),
    }
    this.axios.post(`http://logs-01.loggly.com/inputs/${this.token}/tag/http/`, json)
  }

  info = (first, ...rest) => this.winstonLogger.info(first, ...rest)

  warn = (first, ...rest) => this.winstonLogger.warn(first, ...rest)

  error = (first, ...rest) => this.winstonLogger.error(first, ...rest)

}

export const logger = new DappHeroLogger()
