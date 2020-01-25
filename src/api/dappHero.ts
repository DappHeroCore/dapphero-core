import Axios from 'axios'
import abi from '../abi/DappHeroTest.json' // eslint-disable-line

const axios = Axios.create()

const DEV_URL = 'https://dapphero-admin.bubbleapps.io/version-test/api/1.1/wf/contracts'
const PROD_URL = 'https://dapphero-admin.bubbleapps.io/version-test/api/1.1/wf/contracts'

const BASE_URL = process.env.NODE_ENV === 'development' ? DEV_URL : PROD_URL

export const getContractByName = (contractName) => ({
  abi,
  contractAddress: '0x665605c40EECc83B51B56ad59bbEeaeF1aFE3330',
  networkId: 3,
})

export const getContractsByProjectUrl = async (projectUrl) => {
  const body = { projectUrl }
  const { data } = await axios.post(BASE_URL, body)
  return JSON.parse(data)
}
