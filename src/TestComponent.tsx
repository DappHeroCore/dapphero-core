import React, { useEffect } from "react";
import { randomHex, getTransactionCount } from "./api/ethereum";
import Web3 from "web3";

const infuraUrl =
  "https://mainnet.infura.io/v3/b520d227f8e1479ab2bf09aebb9ea6db";

// const web3 = new Web3((window as any).ethereum);
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
console.log(web3)

// mainnet
const testExternalAddress = "0xb5360d78643A0B0F39B4f32c629A2A920b74E3dC";
const testContractAddress = "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95";

const blockHashOrNumber =
  "0xba635d671a01d7fc35e502af36c5c2831d9f92281c043a98ce58b65f58ec57a0";
const txHash =
  "0xee2e3b374c9329337a57b485206902854fa1554898305193f004a4c21c9470e1";

function TestComponent() {
  useEffect(() => {
    const runTest = async () => {
      // const retVal = await getTransactionCount(testExternalAddress, web3);
      const retVal = randomHex(web3, 32)
      console.log("retVal", retVal);
    };
    runTest();
  }, []);

  return <div>test</div>;
}

export default TestComponent;
