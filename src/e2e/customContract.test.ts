import puppeteer from 'puppeteer'
import { ethers } from 'ethers'
import * as dappeteer from 'dappeteer'
import dotenv from 'dotenv'

// Load env variables
dotenv.config()

// Helpers - Attributes
const createMethodAttribute = (id): string => `[data-dh-property-method-id="${id}"]`
const createOutputAttribute = (): string => `[data-dh-property-outputs]`
const createOutputNameAttribute = (name = ''): string => `[data-dh-property-output-name="${name}"]`
const createInputAttribute = (name = ''): string => `[data-dh-property-input-name="${name}"]`

// Helpers - Selectors
const createParentSelector = (id: string): string => `div${createMethodAttribute(id)}`
const createSubmitButtonSelector = (id: string): string => `button${createMethodAttribute(id)}`
const createInputSelector = (id: string, inputName: string): string => `input${createMethodAttribute(id)}${createInputAttribute(inputName)}`
const createOutputDivSelector = (id: string): string => `div${createMethodAttribute(id)}${createOutputAttribute()}`
const createOutputNameDivSelector = (id: string, outputName?: string): string => `div${createMethodAttribute(id)}${createOutputNameAttribute(outputName)}`

// Constants
const ACCOUNTS = { default: 1 }
const NETWORKS = { rinkeby: 'rinkeby' }
const { E2E_METAMASK_ADDRESS, E2E_METAMASK_SEED, E2E_METAMASK_PASSWORD } = process.env

// Increast Jest default timeout
jest.setTimeout(2000000)

// Test setup
let page
let browser
let metamask

beforeAll(async (done) => {
  browser = await dappeteer.launch(puppeteer, {
    slowMo: 20,
    devtools: true,
    defaultViewport: null,
  })

  metamask = await dappeteer.getMetamask(browser, {
    seed: E2E_METAMASK_SEED,
    password: E2E_METAMASK_PASSWORD,
  })

  // Switch Metamask network and account
  await metamask.switchNetwork(NETWORKS.rinkeby)
  await metamask.switchAccount(ACCOUNTS.default)

  // Go to server url
  page = await browser.newPage()
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' })

  // Wait until React loads and run internal logic
  await page.waitFor(4000)

  done()
})

afterAll(async () => {
  await browser.close()
})

describe('Test CustomContract feature for "hello" method', () => {
  it('should test "hello" method', async () => {
    const ID = '000'
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Trigger Submit
    await page.click(submitButtonSelector)

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const EXPECTED_OUTPUT = 'Howdy'
    expect(outputText).toBe(EXPECTED_OUTPUT)
  })
})

describe('Test CustomContract feature for "sendEthWithArgs" methods', () => {
  it('should test "sendEthWithArgs" method', async () => {
    // Method id
    const ID = '001'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)
    const inputSelector = createInputSelector(ID, 'simpleMessage')

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Type
    const message = ethers.utils.formatBytes32String('DappHero')
    await page.focus(inputSelector)
    await page.keyboard.type(message)

    // Submit Method
    await page.click(submitButtonSelector)

    // Confirm Metamask transaction
    await page.waitFor(1000)
    await metamask.confirmTransaction()
    await page.bringToFront()

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const isHexString = ethers.utils.isHexString(outputText)
    expect(isHexString).toBeTruthy()
  })

  it('should test "sendEthWithArgs" method with hardcoded Eth', async () => {
    // Method id
    const ID = '001a'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)
    const inputSelector = createInputSelector(ID, 'simpleMessage')

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Type
    const message = ethers.utils.formatBytes32String('DappHero')
    await page.focus(inputSelector)
    await page.keyboard.type(message)

    // Submit Method
    await page.click(submitButtonSelector)

    // Confirm Metamask transaction
    await page.waitFor(1000)
    await metamask.confirmTransaction()
    await page.bringToFront()

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const isHexString = ethers.utils.isHexString(outputText)
    expect(isHexString).toBeTruthy()
  })

  it('should test "sendEthWithArgs" method with user input Eth', async () => {
    // Method id
    const ID = '001b'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Submit Method
    await page.click(submitButtonSelector)

    // Confirm Metamask transaction
    await page.waitFor(1000)
    await metamask.confirmTransaction()
    await page.bringToFront()

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const isHexString = ethers.utils.isHexString(outputText)
    expect(isHexString).toBeTruthy()
  })
})

describe('Test CustomContract feature for "viewMultipleArgs" method', () => {
  it('should test "viewMultipleArgsMultipleReturn"', async () => {
    // Method id
    const ID = '002'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)
    const amountInputSelector = createInputSelector(ID, 'amount')
    const fromAddressinputSelector = createInputSelector(ID, 'fromAddress')

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Type Address
    await page.focus(fromAddressinputSelector)
    await page.keyboard.type(E2E_METAMASK_ADDRESS)

    // Type Amount (multiplier)
    await page.focus(amountInputSelector)
    await page.keyboard.type('1')

    // Submit Method
    await page.click(submitButtonSelector)

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const [ balanceMultiplied, messageBytes32 ] = outputText.split(',')
    const decodedMessage = ethers.utils.parseBytes32String(messageBytes32)

    const EXPECTED_DECODED_MESSAGE_OUTPUT = 'Howdy'
    const EXPECTED_ENCODED_MESSAGE_OUTPUT = '0x486f776479000000000000000000000000000000000000000000000000000000'

    expect(messageBytes32).toBe(EXPECTED_ENCODED_MESSAGE_OUTPUT)
    expect(decodedMessage).toBe(EXPECTED_DECODED_MESSAGE_OUTPUT)

    // TODO: Convert balanceMultiplied to check converted value
    const EXPECTED_BALANCE_MULTIPLIED_OUTPUT = '8989898989'
    expect(balanceMultiplied).toBe(EXPECTED_BALANCE_MULTIPLIED_OUTPUT)
  })

  it('should test "viewMultipleArgsSingleReturn"', async () => {
    // Method id
    const ID = '004'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)
    const amountInputSelector = createInputSelector(ID, 'amount')
    const fromAddressinputSelector = createInputSelector(ID, 'fromAddress')

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Type Address
    await page.focus(fromAddressinputSelector)
    await page.keyboard.type(E2E_METAMASK_ADDRESS)

    // Type Amount (multiplier)
    await page.focus(amountInputSelector)
    await page.keyboard.type('1')

    // Submit Method
    await page.click(submitButtonSelector)

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    // TODO: Convert balanceMultiplied to check converted value
    const EXPECTED_BALANCE_MULTIPLIED_OUTPUT = '89898989'
    expect(outputText).toBe(EXPECTED_BALANCE_MULTIPLIED_OUTPUT)
  })
})

describe('Test CustomContract feature for "sendVariableEthNoArgs" and "viewNoArgsMultipleReturn" methods', () => {
  it('should test "sendVariableEthNoArgs" method with user input Eth', async () => {
    // Method id
    const ID = '003'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Submit Method
    await page.click(submitButtonSelector)

    // Confirm Metamask transaction
    await page.waitFor(1000)
    await metamask.confirmTransaction()
    await page.bringToFront()

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const isHexString = ethers.utils.isHexString(outputText)
    expect(isHexString).toBeTruthy()
  })

  it('should test "viewNoArgsMultipleReturn" method with user input Eth', async () => {
    // Method id
    const ID = '005'

    // Selectors
    const parentSelector = createParentSelector(ID)
    const allOutputsDivSelector = createOutputDivSelector(ID)
    const helloOutputDivSelector = createOutputNameDivSelector(ID, 'sayHello')
    const importantNumberOutputDivSelector = createOutputNameDivSelector(ID, 'importantNumber')
    const submitButtonSelector = createSubmitButtonSelector(ID)

    // Scroll into element
    const parentDiv = await page.$(parentSelector)
    await page.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), parentDiv)
    await page.waitFor(1000)

    // Submit Method
    await page.click(submitButtonSelector)

    // Wait until method it's triggered and returns value
    await page.waitFor(4000)

    const allOutputsDiv = await page.$(allOutputsDivSelector)
    const allOutputsText = await page.evaluate((el) => el.innerText, allOutputsDiv)

    const helloOutputDiv = await page.$(helloOutputDivSelector)
    const helloOutputText = await page.evaluate((el) => el.innerText, helloOutputDiv)

    const importantNumberOutputDiv = await page.$(importantNumberOutputDivSelector)
    const importantNumberOutputText = await page.evaluate((el) => el.innerText, importantNumberOutputDiv)

    const [ numberOutput, hexNumberOutput ] = allOutputsText.split(',')

    const EXPECTED_DECODED_MESSAGE_OUTPUT = 'Howdy'
    const EXPECTED_ENCODED_MESSAGE_OUTPUT = '0x486f776479000000000000000000000000000000000000000000000000000000'
    expect(helloOutputText).toBe(EXPECTED_DECODED_MESSAGE_OUTPUT)

    const EXPECTED_IMPORTANT_NUMBER_OUTPUT = '0.000'
    expect(importantNumberOutputText).toBe(EXPECTED_IMPORTANT_NUMBER_OUTPUT)

    const EXPECTED_ALL_OUTPUTS_IMPORTANT_NUMBER_OUTPUT = '0'
    const isHexNumberHexString = ethers.utils.isHexString(hexNumberOutput)

    expect(isHexNumberHexString).toBeTruthy()
    expect(numberOutput).toBe(EXPECTED_ALL_OUTPUTS_IMPORTANT_NUMBER_OUTPUT)
    expect(numberOutput).toBe(EXPECTED_ALL_OUTPUTS_IMPORTANT_NUMBER_OUTPUT)
    expect(allOutputsText).toBe(`${EXPECTED_ALL_OUTPUTS_IMPORTANT_NUMBER_OUTPUT},${EXPECTED_ENCODED_MESSAGE_OUTPUT}`)
  })
})
