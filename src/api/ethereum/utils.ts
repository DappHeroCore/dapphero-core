import Web3 from 'web3'
import BN from 'bn.js'
import { Hex } from 'web3-utils'

export const randomHex = (web3Instance: Web3, size: number): string => web3Instance.utils.randomHex(size)

export const isBN = (web3Instance: Web3, bnInstance: any): boolean => web3Instance.utils.isBN(bnInstance)

export const isBigNumber = (
  web3Instance: Web3,
  bigNumberInstance: any
): boolean => web3Instance.utils.isBigNumber(bigNumberInstance)

export const sha3 = (web3Instance: Web3, input: string): string => web3Instance.utils.sha3(input)

export const soliditySha3 = (web3Instance: Web3, input: any): string => web3Instance.utils.soliditySha3(input)

export const isHex = (web3Instance: Web3, input: string | Hex): boolean => web3Instance.utils.isHex(input)

export const isHexStrict = (
  web3Instance: Web3,
  input: string | Hex
): boolean => web3Instance.utils.isHexStrict(input)

export const isAddress = (web3Instance: Web3, address: string): boolean => web3Instance.utils.isAddress(address)

export const toChecksumAddress = (
  web3Instance: Web3,
  address: string
): string => web3Instance.utils.toChecksumAddress(address)

export const checkAddressChecksum = (
  web3Instance: Web3,
  address: string
): boolean => web3Instance.utils.checkAddressChecksum(address)

export const toHex = (
  web3Instance: Web3,
  input: string | number | BN
): string => web3Instance.utils.toHex(input)

export const toBN = (web3Instance: Web3, input: number | Hex): BN => web3Instance.utils.toBN(input)

export const hexToNumberString = (
  web3Instance: Web3,
  hexString: string | Hex
): string => web3Instance.utils.hexToNumberString(hexString)

export const hexToNumber = (
  web3Instance: Web3,
  hexString: string | Hex
): number => web3Instance.utils.hexToNumber(hexString)

export const numberToHex = (
  web3Instance: Web3,
  number: string | number | BN
): string => web3Instance.utils.numberToHex(number)

export const hexToUtf8 = (web3Instance: Web3, hex: string): string => web3Instance.utils.hexToUtf8(hex)

export const hexToAscii = (web3Instance: Web3, hex: string): string => web3Instance.utils.hexToAscii(hex)

export const utf8ToHex = (web3Instance: Web3, string: string): string => web3Instance.utils.utf8ToHex(string)

export const asciiToHex = (web3Instance: Web3, string: string): string => web3Instance.utils.asciiToHex(string)

export const hexToBytes = (web3Instance: Web3, hex: string | Hex): any[] => web3Instance.utils.hexToBytes(hex) // returns byte array

export const bytesToHex = (web3Instance: Web3, byteArray: any[]): string => web3Instance.utils.bytesToHex(byteArray)

// find unit type
export const toWei = (
  web3Instance: Web3,
  value: string,
  unit?: any // Unit type
): string => web3Instance.utils.toWei(value, unit)

// find unit type
export const fromWei = (
  web3Instance: Web3,
  value: string | BN,
  unit?: any // Unit type
): string => web3Instance.utils.fromWei(value, unit)

export const padLeft = (
  web3Instance: Web3,
  string: string,
  characterAmount: number,
  sign?: string
): string => web3Instance.utils.padLeft(string, characterAmount, sign)

export const padRight = (
  web3Instance: Web3,
  string: string,
  characterAmount: number,
  sign?: string
): string => web3Instance.utils.padRight(string, characterAmount, sign)
