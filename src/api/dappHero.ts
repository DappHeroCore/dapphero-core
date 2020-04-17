import Axios from 'axios'
import { logger } from 'logger/customLogger'
import abi from '../abi/DappHeroTest.json' // eslint-disable-line
const axios = Axios.create({ headers: { 'content-type': 'application/json' } })

// Refactor when this is more fleshed out
const BUBBLE_DEV_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'
const BUBBLE_PROD_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'

const BACKEND_DEV_URL = 'https://api.dapphero.io/'
const BACKEND_PROD_URL = 'https://api.dapphero.io/'

const BASE_URL = process.env.NODE_ENV === 'production' ? BUBBLE_PROD_URL : BUBBLE_DEV_URL
const BACKEND_URL = process.env.NODE_ENV === 'production' ? BACKEND_PROD_URL : BACKEND_DEV_URL

const BUBBLE_ENDPOINT = false

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

export const getContractsByProjectKey = async (projectId) => {
  logger.log(`projectId: ${projectId}`)

  const body = { projectId }
  try {
    const axiosResponse = (await axios({
      method: 'post',
      url: `${BACKEND_URL}/projects/${projectId}/contracts/`,
      data: body,
    }))
    const responseData = axiosResponse.data.response.data
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
    return formattedOutput
  } catch (err) {
    logger.error('Error in dappHero api, getContractsByProjectKey', err)
    throw new Error(err)
  }
}
