import puppeteer from 'puppeteer'
import { ethers } from 'ethers'
import * as dappeteer from 'dappeteer'
import dotenv from 'dotenv'

dotenv.config()

// Helpers
const createMethodAttribute = (id): string => `[data-dh-property-method-id="${id}"]`
const createOutputAttribute = (name = ''): string => `[data-dh-property-outputs="${name}"]`
const createInputAttribute = (name = ''): string => `[data-dh-property-input-name="${name}"]`

const createSubmitButtonSelector = (id): string => `button${createMethodAttribute(id)}`
const createOutputDivSelector = (id): string => `div${createMethodAttribute(id)}${createOutputAttribute()}`
const createInputSelector = (id, inputName): string => `input${createMethodAttribute(id)}${createInputAttribute(inputName)}`

// Constants
const NETWORKS = { rinkeby: 'rinkeby' }
const ACCOUNTS = { default: 1 }

// Increast Jest default timeout
jest.setTimeout(20000)

describe('Test CustomContract Feature', () => {
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
      seed: process.env.SEED,
      password: process.env.PASSWORD,
    })

    await metamask.switchNetwork(NETWORKS.rinkeby)
    await metamask.switchAccount(ACCOUNTS.default)

    page = await browser.newPage()
    done()
  })

  it('should test "hello" method', async () => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' })

    // Wait until React loads and run internal logic
    await page.waitFor(4000)

    const ID = '000'
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)

    await page.click(submitButtonSelector)

    // Wait until method it's triggered and returns value
    await page.waitFor(3000)

    const outputDiv = await page.$(outputDivSelector)
    const outputText = await page.evaluate((el) => el.innerText, outputDiv)

    const EXPECTED_OUTPUT = 'Howdy'
    expect(outputText).toBe(EXPECTED_OUTPUT)
  })

  it('should test "sendEthWithArgs" method', async () => {
    // Method id
    const ID = '001'

    // Selectors
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)
    const inputDivSelector = createInputSelector(ID, 'simpleMessage')

    // Type
    const message = ethers.utils.formatBytes32String('DappHero')
    await page.focus(inputDivSelector)
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

  afterAll(async () => {
    // await browser.close()
  })
})
