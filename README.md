# DappHero Core

_dependencies last pinned 1/8/20_

## Listening to events

#### How to use

All listeners functions are defined inside `dappHero` object.

For example to listen after a contract method result it's outputed to the DOM you can simple call:

```javascript
dappHero.listenToContractOutputChange(event => {
   console.log(`Event changed`, event)
})
```

#### Supported events currently are for:

- [x] Custom Contract
- [ ] Network
- [ ] NFT
- [ ] ThreeBox
- [ ] User


### E2E Testing

1. Fulfill the following env variables:

```
E2E_METAMASK_SEED=
E2E_METAMASK_ADDRESS=
E2E_METAMASK_PASSWORD=
```

2. Run the following commands:

```sh
> yarn start // or npm run start
> yarn test:e2e  // or npm run test
```

3. Since tests runs on Rinkeby network you will need Eth you can use [Rinkeby Faucet](https://faucet.rinkeby.io)

   I. Paste this [twitter link](https://twitter.com/intent/tweet?text=Requesting%20faucet%20funds%20into%200x0000000000000000000000000000000000000000%20on%20the%20%23Rinkeby%20%23Ethereum%20test%20network.) into a new browser tab

   II. Change `0x0000000000000000000000000000000000000000` for your address, the one you wrote on the env file (E2E_METAMASK_ADDRESS)

![Captura de Pantalla 2020-02-21 a la(s) 19.20.47](https://i.imgur.com/thXJHfw.png)

III. Copy the Twitter link from your profile to the Faucet input

![Captura de Pantalla 2020-02-21 a la(s) 19.20.47](https://i.imgur.com/1PBDcFR.png)

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

### Eslint fix example

For `getBaseContractData` file
`npx eslint --fix src/modules/eth/utils/getBaseContractData.ts`
