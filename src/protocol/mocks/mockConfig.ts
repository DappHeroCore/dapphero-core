import ERC20 from '../../abi/ERC20.json' //eslint-disable-line
import DappHeroTest from '../../abi/DappHeroTest.json'

const mocks = [
  {
    contractName: 'erc20',
    description: 'Weth on Mainnet',
    abi: ERC20,
    contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    networkId: 1,
  },
  {
    contractName: 'erc20',
    description: 'Dai on ropsten',
    abi: ERC20,
    contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
    networkId: 3,
  },
  {
    contractName: 'dappHeroTest',
    description: 'DappHero test contract',
    abi: DappHeroTest,
    contractAddress: '0x665605c40EECc83B51B56ad59bbEeaeF1aFE3330',
    networkId: 3,
  },
  {
    contractName: 'dappheroSkale',
    description: 'Dapphero test on skale',
    abi: DappHeroTest,
    contractAddress: '0x257406C8679a5e0cD6CE3D52052B902B30ac890E',
    networkId: 5,
  },
]

export const mockConfig = { contracts: mocks }
