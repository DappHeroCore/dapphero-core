import Axios from 'axios'
import { logger } from 'logger/customLogger'
import abi from '../abi/DappHeroTest.json' // eslint-disable-line
const axios = Axios.create()

// Refactor when this is more fleshed out
const DEV_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'
const PROD_URL = 'https://dapphero-admin.bubbleapps.io/api/1.1/wf/contracts'

const BASE_URL = process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL

export const getContractByName = (contractName) => ({
  abi,
  contractAddress: '0x665605c40EECc83B51B56ad59bbEeaeF1aFE3330',
  networkId: 3,
})

export const getContractsByProjectKey = async (projectId) => {

  // For Development, on localhost the project URL is empty.
  logger.debug('projectId:', projectId)

  const body = { projectId }
  try {
    const axiosResponse = (await axios({
      method: 'post',
      url: BASE_URL,
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
    logger.debug('Formatted Output: ', formattedOutput)
    return formattedOutput
  } catch (err) {
    // log something here in the future
    throw new Error(err)
  }
}
