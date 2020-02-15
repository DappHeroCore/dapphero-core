const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')

// Helpers
const createMethodAttribute = (id) => `[data-dh-property-method-id="${id}"]`
const createOutputAttribute = (name = '') => `[data-dh-property-outputs="${name}"]`

const createSubmitButtonSelector = (id) => `button${createMethodAttribute(id)}`
const createOutputDivSelector = (id) => `div${createMethodAttribute(id)}${createOutputAttribute()}`

// Config Jest
jest.setTimeout(20000)

describe('Test all customContract methods from DappHeroTest contract', () => {
  let browser
  let metamask
  let page
  let navigationPromise

  beforeAll(async (done) => {
    browser = await dappeteer.launch(puppeteer)
    metamask = await dappeteer.getMetamask(browser, {
      seed: process.env.SEED,
      password: process.env.PASSWORD,
    })

    await metamask.switchNetwork('ropsten')
    page = await browser.newPage()

    navigationPromise = page.waitForNavigation()
    done()
  })

  it('should display "Howdy" after triggerin "hello" method', async () => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' })
    await navigationPromise

    const ID = '000'
    const outputDivSelector = createOutputDivSelector(ID)
    const submitButtonSelector = createSubmitButtonSelector(ID)

    await page.click(submitButtonSelector)
    await page.waitFor(3000)

    const outputText = await page.$eval(outputDivSelector, (el) => el.textContent)

    const EXPECTED_OUTPUT = 'Howdy'
    expect(outputText).toMatch(EXPECTED_OUTPUT)
  })

  afterAll(async () => {
    await browser.close()
  })
})
