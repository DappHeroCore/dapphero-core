import Axios from 'axios'
import { logger } from 'logger/customLogger'

const axios = Axios.create({ headers: { 'content-type': 'application/json' } })

// Refactor when this is more fleshed out
const BUBBLE_DEV_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'
const BUBBLE_PROD_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'

const BASE_URL = process.env.NODE_ENV === 'production' ? BUBBLE_PROD_URL : BUBBLE_DEV_URL

const BUBBLE_ENDPOINT = false

const BACKEND_DEV_URL = 'https://api.dapphero.io'
const BACKEND_PROD_URL = 'https://api.dapphero.io'

const BACKEND_URL = process.env.NODE_ENV === 'production' ? BACKEND_PROD_URL : BACKEND_DEV_URL

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
    url: `BUBBLE_ENDPOINT`,
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
    const output = responseData
    const formattedOutput = output.map((contract) => {
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
  logger.log(`Get Contracts Comparison isEqual: ${isEqual.toString()}`)
  if (!isEqual) {
    logger.log('compareResponses -> compareOutput', compareOutput)
    logger.log('compareResponses -> originalOutput', originalOutput)
  }
}

export const getContractsByProjectKey = async (projectId) => {
  logger.log(`projectId: ${projectId}`)

  const body = { projectId }
  try {
    const startTime = new Date().getTime()
    const axiosResponse = (await axios({
      method: 'post',
      url: BASE_URL,
      data: body,
    }))
    const responseData = axiosResponse.data.response.data
    const { paused } = axiosResponse.data.response
    const output = JSON.parse(responseData)
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

