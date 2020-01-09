import ERC20 from '../../../abi/ERC20.json' // from db
import DappHeroTest from '../../../abi/DappHeroTest.json'
// from db
const contractAddressMock = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH on Mainnet
const contractAddressMockRopsten = '0xad6d458402f60fd3bd25163575031acdce07538d' // DAI on Ropsten
const dappHeroTestAddress = '0xd652a9c23f234fCee253aE9B8362d51d833f1e64' // ropsten
// const dappHeroTestAddress = '0x257406C8679a5e0cD6CE3D52052B902B30ac890E' // skale

// const abi = ERC20
// const contractAddress = contractAddressMockRopsten
const abi = DappHeroTest
const contractAddress = dappHeroTestAddress

export {
  abi,
  contractAddress
}
