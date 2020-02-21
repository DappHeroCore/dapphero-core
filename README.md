# DappHero Core

*dependencies last pinned 1/8/20*

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
