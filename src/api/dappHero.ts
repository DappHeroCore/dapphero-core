import Axios from 'axios'
import { logger } from 'logger/customLogger'
import * as consts from 'consts'

const axios = Axios.create({ headers: { 'content-type': 'application/json' } })

const BUBBLE_ENDPOINT = false
const isProduction = process.env.NODE_ENV === 'production'
const BASE_URL = isProduction ? consts.global.BUBBLE_PROD_URL : consts.global.BUBBLE_DEV_URL
const BACKEND_URL = isProduction ? consts.global.BACKEND_PROD_URL : consts.global.BACKEND_DEV_URL

const POST = 'post'
const GET = 'get'
const PUT = 'put'
const DELETE = 'delete'

export const sendLogsToConsole = (json): void => {
  const { level, deviceId, isAnalytics, projectId, timestamp, message, ...restOfJson } = json
  const logItems = [ ...restOfJson ].map((item) => [ item, '/n' ]).flat(1)
  console.log(message, '\n', ...logItems)
}

export const postLogToDappHeroBackend = (payload) => {
  axios({
    method: POST,
    // url: `http://localhost:5000/log`,
    url: `https://api.dapphero.io/log`,
    data: payload,
  }).catch((e) => {
    console.log(e)
  })
}

export const postLogToBubbleBackend = (payload) => {
  axios({
    method: POST,
    url: `${BUBBLE_ENDPOINT}`,
    data: payload,
  }).catch((e) => {
    console.log(e)
  })
}

export const getContractsByProjectKeyV2 = async (projectId) => {
  try {
    const axiosResponse = await axios({
      method: GET,
      url: `${BACKEND_URL}/projects/${projectId}/contracts/`,
    })
    const responseData = axiosResponse.data
    const { data: contracts, paused } = responseData.response
    const formattedOutput = JSON.parse(contracts).map((contract) => {
      const { contractABI, networkid, projectid, ...rest } = contract
      return {
        ...rest,
        contractAbi: JSON.parse(contractABI),
        networkId: networkid,
        projectId: projectid,
      }
    })
    return formattedOutput
  } catch (err) {
    logger.error('Error in dappHero api, getContractsByProjectKeyV2', err)
    throw new Error(err)
  }
}

const compareResponses = async (originalOutput, projectId) => {
  const compareOutput = await getContractsByProjectKeyV2(projectId)
  const isEqual = !!(JSON.stringify(originalOutput) === JSON.stringify(compareOutput))
  // logger.info(`Get Contracts Comparison isEqual: ${isEqual.toString()}`)
  if (!isEqual) {
    logger.info('compareResponses -> compareOutput', compareOutput)
    logger.info('compareResponses -> originalOutput', originalOutput)
  }
}

export const getContractsByProjectKey = async (projectId) => {
  logger.log(`projectId: ${projectId}`)

  const body = { projectId }
  try {
    const axiosResponse = (await axios({
      method: 'post',
      url: BASE_URL,
      data: body,
    }))
    const responseData = axiosResponse.data
    const { paused, data: contracts } = responseData.response
    const output = JSON.parse(contracts)
    const formattedOutput = output.map((contract) => {
      const { contractABI, networkid, projectid, ...rest } = contract
      return {
        ...rest,
        contractAbi: JSON.parse(contractABI),
        networkId: networkid,
        projectId: projectid,
      }
    })

    try {
      compareResponses(formattedOutput, projectId)
    } catch (err) {
      // handle error
    }
    return { formattedOutput, paused }
  } catch (err) {
    logger.error('Error in dappHero api, getContractsByProjectKey', err)
    throw new Error(err)
  }
}

