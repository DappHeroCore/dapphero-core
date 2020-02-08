import { Cookies } from 'react-cookie'
import * as consts from 'consts'
import { logger } from 'logger/customLogger'
import cuid from 'cuid'
import * as config from 'config'

const cookies = new Cookies()

const checkAndSetLastVisited = () => {
  const lastVisit = cookies.get(consts.cookies.lastVisit)
  if (lastVisit != null) {
    config.app.lastVisit = lastVisit
    logger.info({ lastVisit })
  }
  cookies.set(consts.cookies.lastVisit, new Date().getTime())
}

const checkAndSetDeviceId = () => {
  const prevDeviceId = cookies.get(consts.cookies.deviceId)
  const deviceId = prevDeviceId ?? cuid()
  if (prevDeviceId == null) {
    cookies.set(consts.cookies.deviceId, deviceId)
  }
  config.app.deviceId = deviceId
}

export const startup = () => {
  checkAndSetLastVisited()
  checkAndSetDeviceId()
}
