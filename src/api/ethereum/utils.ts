import BN from 'bn.js'
import Web3Utils, { Hex } from 'web3-utils'

export const randomHex = (size: number): string => Web3Utils.randomHex(size)

export const isBN = (bnInstance: any): boolean => Web3Utils.isBN(bnInstance)

export const isBigNumber = (bigNumberInstance: any): boolean => Web3Utils.isBigNumber(bigNumberInstance)

export const sha3 = (input: string): string => Web3Utils.sha3(input)

export const soliditySha3 = (input: any): string => Web3Utils.soliditySha3(input)

export const isHex = (input: string | Hex): boolean => Web3Utils.isHex(input)

export const isHexStrict = (input: string | Hex): boolean => Web3Utils.isHexStrict(input)

export const isAddress = (address: string): boolean => Web3Utils.isAddress(address)

export const toChecksumAddress = (address: string): string => Web3Utils.toChecksumAddress(address)

export const checkAddressChecksum = (address: string): boolean => Web3Utils.checkAddressChecksum(address)

export const toHex = (input: string | number | BN): string => Web3Utils.toHex(input)

export const toBN = (input: number | Hex): BN => Web3Utils.toBN(input)

export const hexToNumberString = (hexString: string | Hex): string => Web3Utils.hexToNumberString(hexString)

export const hexToNumber = (hexString: string | Hex): number => Web3Utils.hexToNumber(hexString)

export const numberToHex = (number: string | number | BN): string => Web3Utils.numberToHex(number)

export const hexToUtf8 = (hex: string): string => Web3Utils.hexToUtf8(hex)

export const hexToAscii = (hex: string): string => Web3Utils.hexToAscii(hex)

export const utf8ToHex = (string: string): string => Web3Utils.utf8ToHex(string)

export const asciiToHex = (string: string): string => Web3Utils.asciiToHex(string)

export const hexToBytes = (hex: string | Hex): any[] => Web3Utils.hexToBytes(hex) // returns byte array

export const bytesToHex = (byteArray: any[]): string => Web3Utils.bytesToHex(byteArray)

export const abridgedAddress = (str: string): string => str.slice(0, 6) + '...' + str.slice(38)

// find unit type
export const toWei = (
  value: string,
  unit?: any, // Unit type
): string => Web3Utils.toWei(value, unit)

// find unit type
export const fromWei = (
  value: string | BN,
  unit?: any, // Unit type
): string => Web3Utils.fromWei(value, unit)

export const padLeft = (
  string: string,
  characterAmount: number,
  sign?: string,
): string => Web3Utils.padLeft(string, characterAmount, sign)

export const padRight = (
  string: string,
  characterAmount: number,
  sign?: string,
): string => Web3Utils.padRight(string, characterAmount, sign)
