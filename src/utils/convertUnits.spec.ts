import { convertUnits } from './convertUnits'

describe('convertUnits function', () => {

  test(`given wei return ether`, () => {
    const weiValue = '50000000000000000' // 5E16 or 0.05 Ether
    const convertedUnits = convertUnits('wei', 'ether', weiValue)
    expect(convertedUnits).toBe('0.05')
  })
  test(`given ether return wei`, () => {
    const value = '0.05'
    const convertedUnits = convertUnits('ether', 'wei', value)
    expect(convertedUnits).toBe('50000000000000000')
  })
})
